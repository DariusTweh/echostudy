import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import dotenv from 'dotenv';
dotenv.config();

const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const Papa = require('papaparse'); // ⬅️ make sure this is installed: `npm install papaparse`
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateFlashcardsFromPdf = async (pdfPath, originalName, deckId) => {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const pdfDoc = await pdfjsLib.getDocument({ data }).promise;

  const cards = [];

  for (let i = 0; i < pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i + 1);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str).join(' ');
    const slideText = strings.trim();

    if (!slideText || slideText.length < 20) continue;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You're a flashcard assistant. Only return a clean JSON array like:
[
  { "question": "What is X?", "answer": "Y" }
]`
        },
        {
          role: 'user',
          content: `Create flashcards from this slide:\n\n${slideText}`
        }
      ],
      temperature: 0.4
    });

    const raw = completion.choices[0]?.message?.content;

    try {
      const parsed = JSON.parse(raw);
      parsed.forEach(card => cards.push(card));
      console.log(`✅ Slide ${i + 1} complete`);
    } catch (err) {
      console.error(`❌ JSON error on slide ${i + 1}:`, raw);
    }
  }

  // Save CSV
  const outputDir = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const filename = `${originalName.replace('.pdf', '')}.csv`;
  const filepath = path.join(outputDir, filename);
  const csv = cards.map(c => `"${c.question}","${c.answer}"`).join('\n');
  fs.writeFileSync(filepath, 'Term,Definition\n' + csv);

  // ✅ Parse CSV with PapaParse
  const csvText = fs.readFileSync(filepath, 'utf8');
  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  console.log('📦 Parsed CSV rows:', parsed.data.length);

  // ✅ Insert flashcards into Supabase
  if (deckId && parsed.data.length > 0) {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const flashcards = parsed.data.map(row => ({
      deck_id: deckId,
      term: row.Term?.trim() || '',
      definition: row.Definition?.trim() || '',
      tags: [],
      ai_generated: true,
      ease_factor: 2.5,
      interval: 1,
      repetitions: 0,
      last_reviewed: null,
      next_review_date: null,
      source_note_id: null,
    }));

    try {
      const { error: insertError } = await supabase.from('flashcards').insert(flashcards);
      if (insertError) {
        console.error('❌ Flashcard insert error:', insertError);
      } else {
        console.log(`✅ ${flashcards.length} flashcards inserted`);
      }
    } catch (err) {
      console.error('❌ Supabase insert exception:', err);
    }

    // ✅ Update deck status to 'ready'
    try {
      const { error: updateError } = await supabase
        .from('flashcard_decks')
        .update({ status: 'ready' })
        .eq('id', deckId);

      if (updateError) {
        console.error('❌ Failed to update deck status:', updateError);
      } else {
        console.log(`✅ Deck ${deckId} marked as ready`);
      }
    } catch (err) {
      console.error('❌ Supabase update exception:', err);
    }
  }

  return { filename, totalCards: cards.length };
};
