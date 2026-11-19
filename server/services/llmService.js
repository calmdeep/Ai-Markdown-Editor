import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Helper to get the GenAI client instance
 */
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new Error(
      'Gemini API key is missing. Please set GEMINI_API_KEY in server/.env (get one free at https://aistudio.google.com/app/apikey)'
    );
  }
  return new GoogleGenAI({ apiKey: apiKey.trim() });
}

// Strip markdown code block wrapper if present
function stripEnclosingMarkdownBlock(text) {
  if (!text) return '';
  const trimmed = text.trim();
  const markdownBlockRegex = /^```(?:markdown|md)?\r?\n([\s\S]*?)\r?\n```$/i;
  const match = trimmed.match(markdownBlockRegex);
  if (match) {
    return match[1].trim();
  }
  return trimmed;
}

// Format API errors into readable messages
function formatLlmError(error) {
  const rawMsg = error?.message || String(error);
  try {
    const parsed = JSON.parse(rawMsg);
    if (parsed?.error?.message) {
      return parsed.error.message;
    }
  } catch {
    // not JSON
  }
  if (rawMsg.includes('503') || rawMsg.includes('high demand') || rawMsg.includes('UNAVAILABLE')) {
    return 'The AI model is temporarily experiencing high traffic. Please retry in a few moments.';
  }
  if (rawMsg.includes('429') || rawMsg.includes('RESOURCE_EXHAUSTED')) {
    return 'AI rate limit reached. Please wait a moment before sending another request.';
  }
  return rawMsg;
}

// Generate content using Gemini API
async function generate(prompt, systemInstruction = '') {
  const ai = getGenAIClient();
  const primaryModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const modelsToTry = [
    primaryModel,
    'gemini-flash-latest',
    'gemini-2.5-flash-lite',
    'gemini-flash-lite-latest'
  ].filter((model, idx, arr) => arr.indexOf(model) === idx);

  const contents = systemInstruction
    ? `${systemInstruction}\n\n---\n\n${prompt}`
    : prompt;

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
      });
      return stripEnclosingMarkdownBlock(response.text || '');
    } catch (err) {
      lastError = err;
      const isRecoverable =
        err?.message?.includes('503') ||
        err?.message?.includes('UNAVAILABLE') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('not found') ||
        err?.message?.includes('404');

      if (isRecoverable && model !== modelsToTry[modelsToTry.length - 1]) {
        console.warn(`[LLM Service] Model '${model}' was busy or unavailable. Trying fallback...`);
        continue;
      }
      break;
    }
  }

  throw new Error(formatLlmError(lastError));
}

// Grammar & spelling correction
export async function correctGrammar(content) {
  const systemInstruction = `You are an expert technical editor.
Your task is to fix grammar, spelling, punctuation, and typographical mistakes in the provided Markdown content.
CRITICAL RULES:
- Preserve all existing Markdown formatting: headings, links, bold/italic, tables, code blocks, and lists.
- Do NOT alter code snippets or URLs.
- Return ONLY the corrected Markdown text. Do NOT add any preamble, conversational greeting, or explanations.`;

  const prompt = `Please correct the grammar and spelling in the following Markdown text:\n\n${content}`;
  return await generate(prompt, systemInstruction);
}

// Rewrite text with specified style
export async function rewriteText(content, style = 'professional') {
  const styleDescriptions = {
    professional: 'polished, clear, and business-professional tone',
    academic: 'formal, scholarly, precise, and objective tone suitable for research/academics',
    concise: 'ultra-concise, eliminating fluff, filler words, and redundancies',
    engaging: 'creative, dynamic, compelling, and conversational tone',
    technical: 'precise, rigorous, and technical tone focusing on clarity and documentation standards'
  };

  const selectedTone = styleDescriptions[style] || styleDescriptions.professional;

  const systemInstruction = `You are a professional writing and content enhancement assistant.
Your task is to rewrite the provided Markdown text to achieve a ${selectedTone}.
CRITICAL RULES:
- Retain the original meaning and factual accuracy.
- Preserve all structural Markdown elements (headings, tables, lists, links, inline code).
- Return ONLY the rewritten Markdown. Do NOT add preamble or meta-commentary.`;

  const prompt = `Please rewrite the following Markdown text using a ${selectedTone}:\n\n${content}`;
  return await generate(prompt, systemInstruction);
}

// Summarize document
export async function summarizeDocument(content, format = 'structured') {
  const formatInstructions = {
    bullet: 'a clean, prioritized bulleted list of key takeaways',
    executive: 'an executive summary with a short intro paragraph followed by high-level takeaways',
    structured: 'a well-structured brief with ## Key Highlights, ## Core Discussion, and ## Action Items / Conclusions'
  };

  const instructionFormat = formatInstructions[format] || formatInstructions.structured;

  const systemInstruction = `You are an executive research assistant specializing in synthesising documents.
Your task is to generate a comprehensive Markdown summary of the provided text.
CRITICAL RULES:
- Format the output as ${instructionFormat}.
- Ensure the summary is insightful, accurate, and easy to read.
- Return ONLY valid Markdown. Do NOT include greetings or preamble.`;

  const prompt = `Please summarize the following document:\n\n${content}`;
  return await generate(prompt, systemInstruction);
}

// Format notes into structured markdown
export async function notesToMarkdown(content) {
  const systemInstruction = `You are a knowledge management and documentation expert.
Your task is to take raw, disorganized, bulleted, or unstructured notes and transform them into beautifully organized, professional Markdown documentation.
CRITICAL RULES:
- Add logical hierarchy: Title (#), Sections (##), Subsections (###).
- Group related points into clean bullet lists or numbered lists.
- Highlight key terms with bold text where appropriate.
- Format any technical terms, file names, or code snippets with backticks.
- If there are action items or key takeaways, create a dedicated ## Action Items or ## Summary section.
- Return ONLY the clean, structured Markdown content.`;

  const prompt = `Transform the following rough notes into structured, production-ready Markdown:\n\n${content}`;
  return await generate(prompt, systemInstruction);
}
