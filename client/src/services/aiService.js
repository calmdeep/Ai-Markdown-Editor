/**
 * Client service to communicate with Express AI backend (/api/ai)
 */

export const MAX_INPUT_LENGTH = 50000;

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const AI_OPERATIONS = {
  GRAMMAR: 'improve-grammar',
  REWRITE: 'rewrite',
  SUMMARIZE: 'summarize',
  STRUCTURE_NOTES: 'structure-notes'
};

/**
 * Checks backend health and AI configuration status
 */
export async function checkAiHealth() {
  try {
    const response = await fetch(`${API_BASE}/api/ai/health`);
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('[AI Service] Health check failed:', error.message);
    return {
      status: 'offline',
      aiConfigured: false,
      error: error.message
    };
  }
}

/**
 * Executes an AI operation via POST /api/ai
 *
 * @param {string} operation - One of 'improve-grammar', 'rewrite', 'summarize', 'structure-notes'
 * @param {string} text - Input markdown text
 * @param {object} options - Optional parameters (e.g. { style: 'academic' }, { format: 'bullet' })
 * @returns {Promise<{ success: boolean, suggestedText: string, operation: string, metadata: object }>}
 */
export async function requestAiAssistance(operation, text, options = {}) {
  // Client-side validation
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Please enter some text in the editor before requesting AI assistance.');
  }

  if (text.length > MAX_INPUT_LENGTH) {
    throw new Error(
      `Input text is ${text.length.toLocaleString()} characters, exceeding the maximum limit of ${MAX_INPUT_LENGTH.toLocaleString()} characters.`
    );
  }

  const payload = {
    operation,
    text,
    options
  };

  try {
    const response = await fetch(`${API_BASE}/api/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.error || `Server error (${response.status}: ${response.statusText})`;
      throw new Error(errorMsg);
    }

    if (!data || !data.success) {
      throw new Error(data?.error || 'Failed to process AI request.');
    }

    return data;
  } catch (error) {
    console.error('[AI Service Error]:', error);
    throw error;
  }
}
