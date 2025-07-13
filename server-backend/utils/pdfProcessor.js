import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { PDFDocument } from 'pdf-lib';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function processPdfToNotes(filePath, originalName, userId, notebookId) {
  const dataBuffer = fs.readFileSync(filePath);
  const fullPdf = await PDFDocument.load(dataBuffer);
  const pageCount = fullPdf.getPageCount();

  const title = path.basename(originalName, path.extname(originalName));
  const generatedPages = [];

  for (let i = 0; i < pageCount; i++) {
    // Extract each page as its own mini PDF
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(fullPdf, [i]);
    newPdf.addPage(copiedPage);
    const singlePageBuffer = await newPdf.save();

    // Extract text from just this page
    const { text: pageText } = await pdfParse(singlePageBuffer);
    const cleaned = pageText.trim();
let aiNote = '⚠️ No readable content on this page.';

if (cleaned) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: `Create clear, organized notes from this lecture page:\n\n${cleaned}`,
      },
    ],
    temperature: 0.4,
  });

  aiNote = completion.choices[0].message.content?.trim() || aiNote;
}

generatedPages.push({
  id: i + 1,
  content: aiNote,
});

  }

  // Save notes with pages[] in JSONB
  const { data, error } = await supabase
    .from('notes')
    .insert([
      {
        user_id: userId,
        notebook_id: notebookId,
        title,
        type: 'Summary',
        pages: generatedPages,
        pinned: false,
        quick_note: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  fs.unlinkSync(filePath);

  if (error) {
    console.error('❌ Supabase insert error:', error);
    throw new Error('Failed to save note to database');
  }

  return { success: true, noteId: data.id };
}
