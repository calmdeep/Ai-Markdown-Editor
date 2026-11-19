import * as llmService from '../services/llmService.js';

const VALID_OPERATIONS = [
  'improve-grammar',
  'rewrite',
  'summarize',
  'structure-notes'
];

const MAX_TEXT_LENGTH = 50000;

export async function handleAiPost(req, res) {
  try {
    const { operation, text, content, options = {} } = req.body || {};
    const inputText = (typeof text === 'string' ? text : content) || '';

    if (!operation || typeof operation !== 'string') {
      return res.status(400).json({
        success: false,
        error: `Missing operation. Allowed operations: ${VALID_OPERATIONS.join(', ')}`
      });
    }

    if (!VALID_OPERATIONS.includes(operation)) {
      return res.status(400).json({
        success: false,
        error: `Invalid operation '${operation}'. Valid operations: ${VALID_OPERATIONS.join(', ')}`
      });
    }

    if (!inputText || inputText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Text content is required."
      });
    }

    if (inputText.length > MAX_TEXT_LENGTH) {
      return res.status(413).json({
        success: false,
        error: `Text is too long (${inputText.length.toLocaleString()} characters). Limit is ${MAX_TEXT_LENGTH.toLocaleString()} characters.`
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      return res.status(503).json({
        success: false,
        error: 'API key is missing. Set GEMINI_API_KEY in environment variables.'
      });
    }

    let suggestedText = '';

    switch (operation) {
      case 'improve-grammar':
        suggestedText = await llmService.correctGrammar(inputText);
        break;

      case 'rewrite':
        suggestedText = await llmService.rewriteText(inputText, options.style || 'professional');
        break;

      case 'summarize':
        suggestedText = await llmService.summarizeDocument(inputText, options.format || 'structured');
        break;

      case 'structure-notes':
        suggestedText = await llmService.notesToMarkdown(inputText);
        break;

      default:
        return res.status(400).json({
          success: false,
          error: `Unknown operation: ${operation}`
        });
    }

    return res.json({
      success: true,
      operation,
      suggestedText,
      result: suggestedText,
      metadata: {
        originalLength: inputText.length,
        suggestedLength: suggestedText.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(`Error in ${req.body?.operation || 'request'}:`, error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error processing request.'
    });
  }
}

export function handleHealth(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here');

  return res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    aiConfigured: isConfigured,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    supportedOperations: VALID_OPERATIONS,
    maxTextLength: MAX_TEXT_LENGTH
  });
}

export async function handleGrammar(req, res) {
  req.body.operation = 'improve-grammar';
  return handleAiPost(req, res);
}

export async function handleRewrite(req, res) {
  req.body.operation = 'rewrite';
  return handleAiPost(req, res);
}

export async function handleSummarize(req, res) {
  req.body.operation = 'summarize';
  return handleAiPost(req, res);
}

export async function handleNotesToMarkdown(req, res) {
  req.body.operation = 'structure-notes';
  return handleAiPost(req, res);
}
