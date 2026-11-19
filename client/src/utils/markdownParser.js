import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Configure Marked with GitHub-Flavored Markdown (GFM)
 */
marked.setOptions({
  gfm: true,
  breaks: true,
  pedantic: false
});

/**
 * Pre-processes GitHub-style alerts:
 * > [!NOTE] -> <div class="markdown-alert alert-note">...</div>
 * > [!TIP]  -> <div class="markdown-alert alert-tip">...</div>
 * > [!IMPORTANT]
 * > [!WARNING]
 * > [!CAUTION]
 */
function preprocessAlerts(markdown) {
  if (!markdown) return '';
  return markdown.replace(
    /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n((?:>.*(?:\n|$))*)/gim,
    (match, alertType, content) => {
      const type = alertType.toLowerCase();
      const cleanContent = content
        .split('\n')
        .map((line) => line.replace(/^>\s?/, ''))
        .join('\n');
      return `<div class="markdown-alert alert-${type}"><div class="alert-title">${alertType}</div>${cleanContent}</div>\n\n`;
    }
  );
}

/**
 * Parses markdown to HTML and sanitizes it with DOMPurify
 */
export function parseAndSanitizeMarkdown(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  try {
    // 1. Process custom alerts
    const processedMd = preprocessAlerts(markdown);

    // 2. Parse Markdown to raw HTML
    const rawHtml = marked.parse(processedMd);

    // 3. Sanitize HTML via DOMPurify
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ADD_TAGS: ['div', 'span'],
      ADD_ATTR: ['target', 'rel', 'class', 'style', 'title'],
      USE_PROFILES: { html: true }
    });

    return cleanHtml;
  } catch (err) {
    console.error('Error parsing markdown:', err);
    return `<div class="preview-error">Error rendering markdown: ${err.message}</div>`;
  }
}

/**
 * Calculates live document metrics
 */
export function calculateDocumentStats(text = '') {
  const characters = text.length;
  const lines = text.length === 0 ? 0 : text.split('\n').length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    words,
    characters,
    lines,
    readingTimeMinutes
  };
}
