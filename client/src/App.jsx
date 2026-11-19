import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import UnifiedToolbar from './components/UnifiedToolbar';
import EditorPane from './components/EditorPane';
import PreviewPane from './components/PreviewPane';
import StatusBar from './components/StatusBar';
import ToastNotification from './components/ToastNotification';
import AiSuggestionModal from './components/AiSuggestionModal';
import { parseAndSanitizeMarkdown, calculateDocumentStats } from './utils/markdownParser';
import { SAMPLE_MARKDOWN } from './utils/sampleContent';
import { downloadMarkdownFile, downloadHtmlFile } from './utils/export';
import { requestAiAssistance } from './services/aiService';
import './App.css';

export default function App() {
  // Document state
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [documentTitle, setDocumentTitle] = useState('System-Architecture.md');

  // Layout view mode: 'split' | 'editor' | 'preview'
  const [viewMode, setViewMode] = useState('split');

  // Split-screen pane width percentage (default 50%)
  const [splitPercent, setSplitPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const workspaceRef = useRef(null);

  // AI Assistant states
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  // Toast notification state
  const [notification, setNotification] = useState(null);

  // CodeMirror EditorView ref for cursor insertions
  const editorViewRef = useRef(null);

  // Memoized parsed HTML for the live preview
  const htmlContent = useMemo(() => {
    return parseAndSanitizeMarkdown(markdown);
  }, [markdown]);

  // Memoized live document statistics
  const stats = useMemo(() => {
    return calculateDocumentStats(markdown);
  }, [markdown]);

  /**
   * Resizable split drag handler
   */
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !workspaceRef.current) return;
      const rect = workspaceRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const newPercent = (currentX / rect.width) * 100;
      if (newPercent >= 20 && newPercent <= 80) {
        setSplitPercent(Math.round(newPercent));
      }
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  /**
   * Insert formatting syntax from toolbar at cursor or selection
   */
  const handleInsert = (before, after = '', defaultText = '') => {
    if (editorViewRef.current) {
      const state = editorViewRef.current.state;
      const selection = state.selection.main;
      const selectedText = state.sliceDoc(selection.from, selection.to) || defaultText;
      const replacement = `${before}${selectedText}${after}`;

      editorViewRef.current.dispatch({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: replacement
        },
        selection: {
          anchor: selection.from + before.length,
          head: selection.from + before.length + selectedText.length
        }
      });
      editorViewRef.current.focus();
    } else {
      setMarkdown((prev) => `${prev}\n${before}${defaultText}${after}`);
    }
  };

  /**
   * Trigger AI writing operation
   */
  const handleTriggerAi = async (operation, options = {}) => {
    if (!markdown || markdown.trim().length === 0) {
      setNotification({
        type: 'error',
        message: 'The editor is empty. Enter some Markdown text first.'
      });
      return;
    }

    setIsAiLoading(true);
    setCurrentOperation(operation);

    try {
      const response = await requestAiAssistance(operation, markdown, options);
      if (response?.suggestedText) {
        setAiSuggestion(response);
      } else {
        throw new Error('AI returned an empty response.');
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message || 'Error communicating with AI service.'
      });
    } finally {
      setIsAiLoading(false);
      setCurrentOperation(null);
    }
  };

  /**
   * Accept AI suggestion -> Update editor content
   */
  const handleAcceptSuggestion = (suggestedText) => {
    setMarkdown(suggestedText);
    setAiSuggestion(null);
    setNotification({
      type: 'success',
      message: 'AI suggestion accepted and applied to your document.'
    });
  };

  /**
   * Append AI suggestion -> Add to bottom of document
   */
  const handleAppendSuggestion = (suggestedText) => {
    setMarkdown((prev) => `${prev.trim()}\n\n---\n\n${suggestedText}`);
    setAiSuggestion(null);
    setNotification({
      type: 'success',
      message: 'AI content appended to document.'
    });
  };

  /**
   * Reject AI suggestion -> Keep original document intact
   */
  const handleRejectSuggestion = () => {
    setAiSuggestion(null);
    setNotification({
      type: 'info',
      message: 'AI suggestion dismissed. Original document preserved.'
    });
  };

  const handleResetSample = () => {
    if (window.confirm('Reset document to sample template? Your current edits will be replaced.')) {
      setMarkdown(SAMPLE_MARKDOWN);
      setNotification({ type: 'info', message: 'Loaded sample document template.' });
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all content from the editor?')) {
      setMarkdown('');
      setNotification({ type: 'info', message: 'Editor content cleared.' });
    }
  };

  const handleDownloadMd = () => {
    downloadMarkdownFile(markdown, documentTitle);
    setNotification({ type: 'success', message: `Exported ${documentTitle} as Markdown.` });
  };

  const handleDownloadHtml = () => {
    downloadHtmlFile(htmlContent, documentTitle);
    setNotification({ type: 'success', message: `Exported ${documentTitle} as HTML webpage.` });
  };

  return (
    <div className="app-container">
      {/* 1. Sleek Top Navigation Header */}
      <Navbar
        documentTitle={documentTitle}
        onTitleChange={setDocumentTitle}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onDownloadMd={handleDownloadMd}
        onDownloadHtml={handleDownloadHtml}
        onResetSample={handleResetSample}
        onClear={handleClear}
      />

      {/* 2. Unified Formatting & AI Intelligence Toolbar */}
      <UnifiedToolbar
        onInsert={handleInsert}
        onTriggerAi={handleTriggerAi}
        isAiLoading={isAiLoading}
        currentOperation={currentOperation}
      />

      {/* 3. Resizable Main Workspace */}
      <main
        ref={workspaceRef}
        className={`workspace-container view-${viewMode} ${isDragging ? 'is-dragging' : ''}`}
      >
        {/* Left Pane: CodeMirror Editor */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div
            className="pane-wrapper pane-left"
            style={viewMode === 'split' ? { width: `${splitPercent}%` } : { width: '100%' }}
          >
            <EditorPane
              value={markdown}
              onChange={(val) => setMarkdown(val)}
              editorRef={editorViewRef}
            />
          </div>
        )}

        {/* Resizable Divider (Only shown in Split View) */}
        {viewMode === 'split' && (
          <div
            className="pane-resizer"
            onMouseDown={handleMouseDown}
            onDoubleClick={() => setSplitPercent(50)}
            title="Drag to resize split panes (double-click to reset 50%)"
          >
            <div className="resizer-handle" />
          </div>
        )}

        {/* Right Pane: Live HTML Preview */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div
            className="pane-wrapper pane-right"
            style={viewMode === 'split' ? { width: `${100 - splitPercent}%` } : { width: '100%' }}
          >
            <PreviewPane htmlContent={htmlContent} />
          </div>
        )}
      </main>

      {/* 4. Bottom Metrics Status Bar */}
      <StatusBar stats={stats} />

      {/* 5. Floating Toast Notification Banner */}
      <ToastNotification
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* 6. AI Suggestion Review Dialog */}
      <AiSuggestionModal
        isOpen={Boolean(aiSuggestion)}
        suggestion={aiSuggestion}
        originalText={markdown}
        onAccept={handleAcceptSuggestion}
        onAppend={handleAppendSuggestion}
        onReject={handleRejectSuggestion}
      />
    </div>
  );
}
