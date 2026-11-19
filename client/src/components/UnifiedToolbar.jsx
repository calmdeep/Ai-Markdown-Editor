import React, { useState, useRef, useEffect } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Strikethrough,
  Quote,
  Code,
  List,
  ListOrdered,
  CheckSquare,
  Link as LinkIcon,
  Table as TableIcon,
  Minus,
  Sparkles,
  FileCheck2,
  Wand2,
  ListTree,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { AI_OPERATIONS } from '../services/aiService';

export default function UnifiedToolbar({
  onInsert,
  onTriggerAi,
  isAiLoading,
  currentOperation
}) {
  const [rewriteStyle, setRewriteStyle] = useState('professional');
  const [summaryFormat, setSummaryFormat] = useState('structured');
  const [showRewriteMenu, setShowRewriteMenu] = useState(false);
  const [showSummaryMenu, setShowSummaryMenu] = useState(false);

  const rewriteRef = useRef(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rewriteRef.current && !rewriteRef.current.contains(e.target)) {
        setShowRewriteMenu(false);
      }
      if (summaryRef.current && !summaryRef.current.contains(e.target)) {
        setShowSummaryMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rewriteStyles = [
    { id: 'professional', label: 'Professional', desc: 'Clear and business-ready' },
    { id: 'academic', label: 'Academic', desc: 'Formal and scholarly' },
    { id: 'concise', label: 'Concise', desc: 'Short and to the point' },
    { id: 'engaging', label: 'Engaging', desc: 'Conversational and lively' },
    { id: 'technical', label: 'Technical', desc: 'Precise and detailed' }
  ];

  const summaryFormats = [
    { id: 'structured', label: 'Structured Brief', desc: 'Organized with headings' },
    { id: 'bullet', label: 'Key Bullets', desc: 'Priority bulleted list' },
    { id: 'executive', label: 'Executive Summary', desc: 'High-level summary' }
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
    <div className="unified-toolbar" role="toolbar" aria-label="Formatting and AI Toolbar">
      {/* Markdown formatting tools */}
      <div className="toolbar-section">
        <div className="tool-group">
          <button
            type="button"
            className="tool-btn"
            title="Heading 1"
            onClick={() => onInsert('# ', '', 'Heading 1')}
          >
            <Heading1 size={16} />
          </button>
          <button
            type="button"
            className="tool-btn"
            title="Heading 2"
            onClick={() => onInsert('## ', '', 'Heading 2')}
          >
            <Heading2 size={16} />
          </button>
          <button
            type="button"
            className="tool-btn"
            title="Heading 3"
            onClick={() => onInsert('### ', '', 'Heading 3')}
          >
            <Heading3 size={16} />
          </button>
        </div>

        <div className="tool-separator" />

        <div className="tool-group">
          <button
            type="button"
            className="tool-btn"
            title="Bold"
            onClick={() => onInsert('**', '**', 'bold text')}
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            className="tool-btn"
            title="Italic"
            onClick={() => onInsert('*', '*', 'italic text')}
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            className="tool-btn"
            title="Strikethrough"
            onClick={() => onInsert('~~', '~~', 'strikethrough')}
          >
            <Strikethrough size={16} />
          </button>
        </div>

        <div className="tool-separator" />

        <div className="tool-group">
          <button
            type="button"
            className="tool-btn"
            title="Quote"
            onClick={() => onInsert('> ', '', 'Quote text')}
          >
            <Quote size={16} />
          </button>
          <button
            type="button"
            className="tool-btn"
            title="Code Block"
            onClick={() => onInsert('```javascript\n', '\n```', '// code here')}
          >
            <Code size={16} />
          </button>
          <button
            type="button"
            className="tool-btn"
            title="Bullet List"
            onClick={() => onInsert('- ', '', 'List item')}
          >
            <List size={16} />
          </button>
          <button
            type="button"
            className="tool-btn"
            title="Numbered List"
            onClick={() => onInsert('1. ', '', 'Numbered item')}
          >
            <ListOrdered size={16} />
          </button>
          <button
            type="button"
            className="tool-btn"
            title="Task List"
            onClick={() => onInsert('- [ ] ', '', 'Task item')}
          >
            <CheckSquare size={16} />
          </button>
          <button
            type="button"
            className="tool-btn"
            title="Insert Link"
            onClick={() => onInsert('[', '](https://example.com)', 'link text')}
          >
            <LinkIcon size={16} />
          </button>
          <button
            type="button"
            className="tool-btn"
            title="Insert Table"
            onClick={() =>
              onInsert(
                '\n| Header 1 | Header 2 |\n| :--- | :--- |\n| Cell 1 | Cell 2 |\n',
                '',
                ''
              )
            }
          >
            <TableIcon size={16} />
          </button>
          <button
            type="button"
            className="tool-btn"
            title="Horizontal Rule"
            onClick={() => onInsert('\n---\n\n', '', '')}
          >
            <Minus size={16} />
          </button>
        </div>
      </div>

      {/* AI Assistant tools */}
      <div className="toolbar-section">
        <div className="ai-tools tool-group">
          <div className="ai-suite-badge">
            <Sparkles size={13} className="sparkle-pulse" />
            <span>AI Tools</span>
          </div>

          {/* Improve Grammar */}
          <button
            type="button"
            className="ai-action-btn"
            disabled={isAiLoading}
            onClick={() => onTriggerAi(AI_OPERATIONS.GRAMMAR)}
            title="Fix grammar, spelling, and typos while keeping markdown formatting"
          >
            {isAiLoading && currentOperation === AI_OPERATIONS.GRAMMAR ? (
              <Loader2 size={13} className="spin-icon" />
            ) : (
              <FileCheck2 size={13} />
            )}
            <span>Fix Grammar</span>
          </button>

          {/* Rewrite dropdown */}
          <div className="ai-dropdown-wrapper" ref={rewriteRef}>
            <button
              type="button"
              className="ai-action-btn"
              disabled={isAiLoading}
              onClick={() => {
                setShowRewriteMenu(!showRewriteMenu);
                setShowSummaryMenu(false);
              }}
              title="Rewrite text in different tone"
            >
              {isAiLoading && currentOperation === AI_OPERATIONS.REWRITE ? (
                <Loader2 size={13} className="spin-icon" />
              ) : (
                <Wand2 size={13} />
              )}
              <span>Rewrite</span>
              <span className="param-tag">{rewriteStyle}</span>
              <ChevronDown size={12} />
            </button>

            {showRewriteMenu && (
              <div className="ai-menu-popover">
                <div className="menu-heading">Tone & Style</div>
                {rewriteStyles.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`menu-option ${rewriteStyle === item.id ? 'selected' : ''}`}
                    onClick={() => handleRewrite(item.id)}
                  >
                    <span className="option-title">{item.label}</span>
                    <span className="option-sub">{item.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Summarize dropdown */}
          <div className="ai-dropdown-wrapper" ref={summaryRef}>
            <button
              type="button"
              className="ai-action-btn"
              disabled={isAiLoading}
              onClick={() => {
                setShowSummaryMenu(!showSummaryMenu);
                setShowRewriteMenu(false);
              }}
              title="Generate summary"
            >
              {isAiLoading && currentOperation === AI_OPERATIONS.SUMMARIZE ? (
                <Loader2 size={13} className="spin-icon" />
              ) : (
                <Sparkles size={13} />
              )}
              <span>Summarize</span>
              <span className="param-tag">{summaryFormat}</span>
              <ChevronDown size={12} />
            </button>

            {showSummaryMenu && (
              <div className="ai-menu-popover">
                <div className="menu-heading">Summary Format</div>
                {summaryFormats.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`menu-option ${summaryFormat === item.id ? 'selected' : ''}`}
                    onClick={() => handleSummarize(item.id)}
                  >
                    <span className="option-title">{item.label}</span>
                    <span className="option-sub">{item.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Structure Notes */}
          <button
            type="button"
            className="ai-action-btn"
            disabled={isAiLoading}
            onClick={() => onTriggerAi(AI_OPERATIONS.STRUCTURE_NOTES)}
            title="Convert raw notes into structured Markdown"
          >
            {isAiLoading && currentOperation === AI_OPERATIONS.STRUCTURE_NOTES ? (
              <Loader2 size={13} className="spin-icon" />
            ) : (
              <ListTree size={13} />
            )}
            <span>Format Notes</span>
          </button>
        </div>

        {isAiLoading && (
          <div className="ai-status-pulse">
            <Loader2 size={12} className="spin-icon" />
            <span>Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
}
