import { supabase } from '../supabaseClient.js';
import { extractTextFromPDF } from './pdfProcessor.js';
import { openai } from './openaiClient.js';

export async function generateQuizFromDeck(deckId, types, count) {
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('deck_id', deckId);

  if (error) throw error;

  const prompt = `
You are an AI quiz generator.

Convert the following flashcards into ${count} quiz questions in this format:
[
  {
    "type": "mcq" or "short",
    "question": "...",
    "options": ["..."] (for MCQ),
    "answer": "...",
    "explanation": "..."
  }
]

Only include question types from: ${types.join(', ')}

FLASHCARDS:
${JSON.stringify(data, null, 2)}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  return parsed.slice(0, count);
}

export async function generateQuizFromPdf(pdfPath, types, count) {
  const slideText = await extractTextFromPDF(pdfPath);

  const prompt = `
You're an AI quiz generator.

From this lecture content, generate ${count} quiz questions using only these types: ${types.join(', ')}.

TEXT:
${slideText.slice(0, 5000)} // truncate if needed
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  return parsed.slice(0, count);
}
