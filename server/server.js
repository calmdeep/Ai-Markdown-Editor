import app from './app.js';

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 AI Markdown Editor Backend listening at http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/ai/health`);
  });
}

export default app;
