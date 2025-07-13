// server-backend/utils/evaluateAnswer.js
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function evaluateAnswer(term, definition, userResponse) {
  const prompt = `
You are a tutor. Evaluate the user's spoken answer to a flashcard prompt.

Flashcard Term: ${term}
Flashcard Answer: ${definition}
User's Spoken Response: ${userResponse}

Rate if their answer is correct, partially correct, or incorrect. Provide a short explanation.
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You evaluate flashcard responses like a tutor.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.4
  });

  return completion.choices[0]?.message?.content?.trim();
}
