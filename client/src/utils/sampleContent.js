export const SAMPLE_MARKDOWN = `# Smart Markdown Editor & Previewer

Welcome to the **Markdown Editor** project. This web application provides a real-time side-by-side markdown editor and HTML previewer, along with automated writing and editing assistance tools.

---

## Features

- **Live Side-by-Side Preview:** Type in Markdown on the left, see the rendered HTML preview on the right.
- **Writing Assistance:**
  - **Grammar & Spell Check:** Checks and corrects grammar while preserving your markdown syntax and code blocks.
  - **Tone & Style Rewrite:** Adjust tone to professional, academic, concise, or technical.
  - **Document Summary:** Generates bulleted key points or executive summaries.
  - **Notes Formatter:** Formats unorganized rough notes into structured headings and bullet lists.
- **Export Options:** Download as clean \`.md\` file or standalone styled \`.html\` document.
- **Safe Rendering:** Sanitizes HTML output with DOMPurify to prevent XSS vulnerabilities.

---

## Tech Stack

| Component | Library / Framework | Purpose |
| :--- | :--- | :--- |
| Frontend | React + Vite | User interface and state management |
| Editor | CodeMirror | Syntax highlighted code editor |
| Parser | Marked | Converts Markdown into HTML |
| Sanitizer | DOMPurify | Sanitizes rendered HTML against security risks |
| Backend | Node.js + Express | API service for grammar and text formatting |

---

## Code Example

\`\`\`javascript
function calculateReadingTime(wordCount) {
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute);
}
\`\`\`

---

## Upcoming Enhancements

- [x] Resizable split-screen editor
- [x] Syntax highlighting for code snippets
- [x] AI grammar, summarize, rewrite, and notes formatting
- [x] Markdown and HTML export
- [ ] Local storage auto-save support
`;
