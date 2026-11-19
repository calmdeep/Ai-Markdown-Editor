import React, { useState, useEffect } from 'react';
import {
  Check,
  X,
  Copy,
  Sparkles,
  FileText,
  Eye,
  PlusCircle,
  Clock,
  ArrowRight,
  Columns
} from 'lucide-react';
import { parseAndSanitizeMarkdown } from '../utils/markdownParser';

export default function AiSuggestionModal({
  isOpen,
  suggestion,
  originalText,
  onAccept,
  onAppend,
  onReject
}) {
  const [activeTab, setActiveTab] = useState('compare'); // 'compare' | 'preview' | 'source'
  const [copied, setCopied] = useState(false);

  // Keyboard shortcut listener: Escape to reject, Ctrl+Enter to accept
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onReject();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        if (suggestion?.suggestedText) {
          onAccept(suggestion.suggestedText);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, suggestion, onAccept, onReject]);

  if (!isOpen || !suggestion) return null;

  const { operation, suggestedText, metadata } = suggestion;

  const operationLabels = {
    'improve-grammar': 'AI Grammar & Polish Correction',
    'rewrite': 'AI Tone & Clarity Rewrite',
    'summarize': 'AI Document Synthesis & Summary',
    'structure-notes': 'AI Structured Documentation'
  };

  const title = operationLabels[operation] || 'AI Writing Assistant Suggestion';
  const originalLength = originalText ? originalText.length : 0;
  const suggestedLength = suggestedText ? suggestedText.length : 0;
  const lengthDiff = suggestedLength - originalLength;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(suggestedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy suggestion:', err);
    }
  };

  const sanitizedHtml = parseAndSanitizeMarkdown(suggestedText);
  const originalHtml = parseAndSanitizeMarkdown(originalText);

  return (
    <div className="modal-backdrop" onClick={onReject}>
      <div
        className="modal-container ai-suggestion-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* 1. Modal Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-sparkle-badge">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="modal-title-row">
                <h2 className="modal-title">{title}</h2>
                <span className="op-pill">{operation}</span>
              </div>
              <div className="modal-meta-row">
                <span className="meta-chip diff-chip">
                  {lengthDiff >= 0 ? `+${lengthDiff}` : lengthDiff} characters
                </span>
                {metadata?.timestamp && (
                  <span className="meta-chip time-chip">
                    <Clock size={11} />
                    {new Date(metadata.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                )}
                <span className="meta-shortcut-hint">Press <strong>Ctrl + Enter</strong> to Accept</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="modal-close-icon-btn"
            onClick={onReject}
            aria-label="Close dialog"
            title="Press Esc to close"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. View Mode Tabs */}
        <div className="modal-tab-bar">
          <div className="tab-buttons-left">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
              onClick={() => setActiveTab('compare')}
            >
              <Columns size={14} />
              <span>Side-by-Side Comparison</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              <Eye size={14} />
              <span>Rendered Preview</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'source' ? 'active' : ''}`}
              onClick={() => setActiveTab('source')}
            >
              <FileText size={14} />
              <span>Raw Markdown Source</span>
            </button>
          </div>

          <div className="tab-buttons-right">
            <button
              type="button"
              className="tab-action-copy-btn"
              onClick={handleCopy}
              title="Copy suggestion to clipboard"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-success" />
                  <span className="text-success">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3. Modal Body Content */}
        <div className="modal-dialog-body">
          {activeTab === 'compare' && (
            <div className="compare-split-view">
              <div className="compare-pane compare-original">
                <div className="compare-pane-header">
                  <span>Original Document</span>
                  <span className="compare-count">{originalText.length} chars</span>
                </div>
                <div
                  className="compare-pane-content markdown-rendered-view"
                  dangerouslySetInnerHTML={{ __html: originalHtml }}
                />
              </div>

              <div className="compare-pane compare-suggested">
                <div className="compare-pane-header header-ai-glow">
                  <div className="flex-align-center">
                    <Sparkles size={12} className="sparkle-pulse" />
                    <span>AI Suggested Version</span>
                  </div>
                  <span className="compare-count count-highlight">{suggestedText.length} chars</span>
                </div>
                <div
                  className="compare-pane-content markdown-rendered-view"
                  dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                />
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="preview-solo-view">
              <div
                className="markdown-rendered-view"
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              />
            </div>
          )}

          {activeTab === 'source' && (
            <div className="source-solo-view">
              <pre className="source-code-block">
                <code>{suggestedText}</code>
              </pre>
            </div>
          )}
        </div>

        {/* 4. Modal Action Footer */}
        <div className="modal-dialog-footer">
          <div className="footer-status-hint">
            <span>Your original document will not be modified unless you click Accept.</span>
          </div>

          <div className="footer-button-group">
            <button
              type="button"
              className="btn btn-neutral"
              onClick={onReject}
            >
              <X size={15} />
              <span>Reject & Keep Original</span>
            </button>

            {operation === 'summarize' && onAppend && (
              <button
                type="button"
                className="btn btn-append"
                onClick={() => onAppend(suggestedText)}
                title="Append to the bottom of your existing document"
              >
                <PlusCircle size={15} />
                <span>Append to End</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn-confirm-accept"
              onClick={() => onAccept(suggestedText)}
            >
              <Check size={16} />
              <span>Accept Suggestion</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
