# Markdown Editor & Previewer with AI Assistant

A full-stack Markdown editor and real-time live previewer with integrated writing tools. Built with a React + Vite frontend and an Express Node.js backend.

---

## ✨ Features

- **Split-Screen Live Preview:** Instant synchronized side-by-side editing and rendering with custom split resizing.
- **AI-Powered Tools (Google Gemini):**
  - 📝 **Grammar & Spell Check:** Fixes mistakes while preserving Markdown formatting and code blocks.
  - 🔄 **Tone Rewriting:** Rewrites content in Professional, Academic, Concise, Technical, or Engaging styles.
  - 📊 **Summarization:** Generates structured executive summaries and bullet points.
  - 📋 **Notes to Markdown:** Automatically formats messy bullet points into structured documents.
- **Exporting:** Download formatted Markdown (`.md`) or clean sanitized HTML (`.html`).
- **Dark / Light Mode:** Sleek modern developer UI with syntax highlighting via CodeMirror.

---

## 🚀 One-Click Deploy to Vercel

This repository is pre-configured with `vercel.json` and serverless functions in `/api` to deploy both frontend and backend seamlessly together on Vercel.

### Deployment Steps:
1. Push this project to your GitHub repository (see [Push to GitHub](#-uploading-to-github)).
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Gemini API key (Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey)).
   - `GEMINI_MODEL`: `gemini-2.5-flash` (optional, defaults to `gemini-2.5-flash`).
5. Click **Deploy**. Vercel will build the frontend and deploy the AI API serverless functions automatically!

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

### 3. Install Dependencies & Run

#### Backend:
```bash
cd server
npm install
npm run dev
```
Backend runs at `http://localhost:5000`.

#### Frontend:
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## 📁 Project Structure

```text
├── api/
│   └── index.js            # Vercel Serverless Function entry point
├── client/                 # React + Vite Frontend application
│   ├── src/
│   │   ├── components/     # UI components (Editor, Preview, Navbar, Toolbar)
│   │   ├── services/       # AI service client
│   │   └── utils/          # Markdown parser & export utilities
│   └── package.json
├── server/                 # Express Backend API
│   ├── controllers/        # Request handlers & validation
│   ├── routes/             # API routes (/api/ai)
│   ├── services/           # AI service logic
│   ├── app.js              # Express app configuration
│   ├── server.js           # Local HTTP server entry
│   └── package.json
├── vercel.json             # Vercel routing & build configuration
├── package.json            # Root configuration for Vercel deployment
└── README.md
```
