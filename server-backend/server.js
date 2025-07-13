import dotenv from 'dotenv';
dotenv.config(); // 👈
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import notesRoutes from './routes/notes.js';
import classBuilderRoute from './routes/classBuilder.js';
import voiceModeRouter from './routes/voiceMode.js';
import flashcardRoutes from './routes/flashcards.js';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ✅ Ensure /output exists
const outputDir = path.join(process.cwd(), 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Routes
app.use('/api/notes', notesRoutes);
app.use('/api/class-builder', classBuilderRoute);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api', voiceModeRouter); // ✅ /api/voice-check

// ✅ Serve TTS mp3 files
app.use('/output', express.static(outputDir));

// Start server
app.listen(port, () => {
  console.log(`🚀 EchoStudy backend running at http://192.168.0.187:${port}`);
});
