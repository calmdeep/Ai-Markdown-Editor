import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();

// Enable CORS for frontend applications (supports both local dev and production domains)
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parsing with generous limit for large Markdown docs
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount AI routes for both /api/ai and /ai (handles serverless routing and local dev)
app.use('/api/ai', aiRoutes);
app.use('/ai', aiRoutes);

// Informational root endpoints
const infoHandler = (req, res) => {
  res.json({
    project: 'AI-Driven Smart Markdown Editor Backend',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      'GET  /api/ai/health',
      'POST /api/ai/grammar',
      'POST /api/ai/rewrite',
      'POST /api/ai/summarize',
      'POST /api/ai/notes-to-markdown'
    ]
  });
};

app.get('/', infoHandler);
app.get('/api', infoHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

export default app;
