import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  FileCheck2,
  ListTree,
  ChevronDown,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { AI_OPERATIONS } from '../services/aiService';

export default function AiToolbar({
  onTriggerAi,
  isLoading,
  currentOperation
}) {
  const [rewriteStyle, setRewriteStyle] = useState('professional');
  const [summaryFormat, setSummaryFormat] = useState('structured');
  const [showRewriteMenu, setShowRewriteMenu] = useState(false);
  const [showSummaryMenu, setShowSummaryMenu] = useState(false);

  const rewriteStyles = [
    { id: 'professional', label: 'Professional Tone' },
    { id: 'academic', label: 'Academic Tone' },
    { id: 'concise', label: 'Concise & Direct' },
    { id: 'engaging', label: 'Engaging & Dynamic' },
    { id: 'technical', label: 'Technical Documentation' }
  ];

  const summaryFormats = [
    { id: 'structured', label: 'Structured Brief' },
    { id: 'bullet', label: 'Key Bullets' },
    { id: 'executive', label: 'Executive Summary' }
  ];

  const handleRewrite = (style) => {
    setRewriteStyle(style);
    setShowRewriteMenu(false);
    onTriggerAi(AI_OPERATIONS.REWRITE, { style });
  };

  const handleSummarize = (format) => {
    setSummaryFormat(format);
    setShowSummaryMenu(false);
    onTriggerAi(AI_OPERATIONS.SUMMARIZE, { format });
  };

  return (
    <div className="ai-toolbar-container" role="region" aria-label="AI Writing Assistant Toolbar">
      <div className="ai-toolbar-badge">
        <Sparkles size={14} className="sparkle-icon" />
        <span>AI Writing Assistant</span>
      </div>

      <div className="ai-actions-group">
        {/* 1. Improve Grammar */}
        <button
          type="button"
          className="ai-btn"
          disabled={isLoading}
          onClick={() => onTriggerAi(AI_OPERATIONS.GRAMMAR)}
          title="Detect and fix grammar, spelling, and typos while keeping markdown formatting"
        >
          {isLoading && currentOperation === AI_OPERATIONS.GRAMMAR ? (
            <Loader2 size={15} className="spin-icon" />
          ) : (
            <FileCheck2 size={15} />
          )}
          <span>Improve Grammar</span>
        </button>

        {/* 2. Rewrite Text Dropdown */}
        <div className="dropdown-wrapper">
          <button
            type="button"
            className="ai-btn ai-btn-dropdown"
            disabled={isLoading}
            onClick={() => {
              setShowRewriteMenu(!showRewriteMenu);
              setShowSummaryMenu(false);
            }}
            title="Rewrite text in selected tone"
          >
            {isLoading && currentOperation === AI_OPERATIONS.REWRITE ? (
              <Loader2 size={15} className="spin-icon" />
            ) : (
              <Wand2 size={15} />
            )}
            <span>Rewrite ({rewriteStyle})</span>
            <ChevronDown size={13} />
          </button>

          {showRewriteMenu && (
            <div className="dropdown-menu">
              <div className="dropdown-header">Select Writing Style</div>
              {rewriteStyles.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`dropdown-item ${rewriteStyle === item.id ? 'active' : ''}`}
                  onClick={() => handleRewrite(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Summarize Document Dropdown */}
        <div className="dropdown-wrapper">
          <button
            type="button"
            className="ai-btn ai-btn-dropdown"
            disabled={isLoading}
            onClick={() => {
              setShowSummaryMenu(!showSummaryMenu);
              setShowRewriteMenu(false);
            }}
            title="Generate executive summary or key takeaways"
          >
            {isLoading && currentOperation === AI_OPERATIONS.SUMMARIZE ? (
              <Loader2 size={15} className="spin-icon" />
            ) : (
              <Sparkles size={15} />
            )}
            <span>Summarize ({summaryFormat})</span>
            <ChevronDown size={13} />
          </button>

          {showSummaryMenu && (
            <div className="dropdown-menu">
              <div className="dropdown-header">Select Summary Format</div>
              {summaryFormats.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`dropdown-item ${summaryFormat === item.id ? 'active' : ''}`}
                  onClick={() => handleSummarize(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Structure Notes */}
        <button
          type="button"
          className="ai-btn"
          disabled={isLoading}
          onClick={() => onTriggerAi(AI_OPERATIONS.STRUCTURE_NOTES)}
          title="Convert rough bullet points and notes into structured Markdown documentation"
        >
          {isLoading && currentOperation === AI_OPERATIONS.STRUCTURE_NOTES ? (
            <Loader2 size={15} className="spin-icon" />
          ) : (
            <ListTree size={15} />
          )}
          <span>Structure Notes</span>
        </button>
      </div>

      {isLoading && (
        <div className="ai-loading-indicator">
          <Loader2 size={14} className="spin-icon" />
          <span>AI is processing your document...</span>
        </div>
      )}
    </div>
  );
}
