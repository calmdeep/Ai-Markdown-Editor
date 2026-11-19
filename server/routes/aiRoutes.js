import { Router } from 'express';
import {
  handleAiPost,
  handleGrammar,
  handleRewrite,
  handleSummarize,
  handleNotesToMarkdown,
  handleHealth
} from '../controllers/aiController.js';

const router = Router();

// Health check
router.get('/health', handleHealth);

// Unified AI operation endpoint: POST /api/ai
router.post('/', handleAiPost);

// Operation aliases for convenience
router.post('/grammar', handleGrammar);
router.post('/improve-grammar', handleGrammar);
router.post('/rewrite', handleRewrite);
router.post('/summarize', handleSummarize);
router.post('/notes-to-markdown', handleNotesToMarkdown);
router.post('/structure-notes', handleNotesToMarkdown);

export default router;
