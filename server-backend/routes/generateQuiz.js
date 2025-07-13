import express from 'express';
import { generateQuizFromDeck, generateQuizFromPdf } from '../utils/quizGenerator.js';

const router = express.Router();

router.post('/generate-quiz', async (req, res) => {
  const {
    title,
    types,
    source,
    numberOfQuestions,
    userId,
    deckId,
    pdfPath,
    notebookId,
  } = req.body;

  try {
    let questions = [];

    if (source === 'Deck') {
      questions = await generateQuizFromDeck(deckId, types, numberOfQuestions);
    } else if (source === 'PDF') {
      questions = await generateQuizFromPdf(pdfPath, types, numberOfQuestions);
    } else {
      return res.status(400).json({ error: 'Unsupported source type' });
    }

    // Save quiz + questions to Supabase
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert([{ title, user_id: userId, notebook_id: notebookId || null }])
      .select();

    if (quizError) throw quizError;

    const quizId = quizData[0].id;

    const formattedQuestions = questions.map((q) => ({
      quiz_id: quizId,
      type: q.type,
      question: q.question,
      options: q.options || null,
      answer: q.answer,
      explanation: q.explanation || '',
    }));

    await supabase.from('quiz_questions').insert(formattedQuestions);

    res.json({ quizId, questions });
  } catch (err) {
    console.error('Quiz generation error:', err);
    res.status(500).json({ error: 'Quiz generation failed' });
  }
});

export default router;
