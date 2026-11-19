import React, { useState } from 'react';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { FileCode, Copy, Check, WrapText } from 'lucide-react';

export default function EditorPane({ value, onChange, editorRef }) {
  const [copied, setCopied] = useState(false);
  const [lineWrap, setLineWrap] = useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy markdown text:', err);
    }
  };

  const extensions = [
    markdown(),
    ...(lineWrap ? [EditorView.lineWrapping] : [])
  ];

  return (
    <div className="pane-container editor-pane">
      <div className="pane-header">
        <div className="pane-header-left">
          <FileCode size={15} className="pane-icon" />
          <span className="pane-title">Markdown Source</span>
          <span className="pane-tag">GFM</span>
        </div>

        <div className="pane-header-right">
          <button
            type="button"
            className={`pane-tool-btn ${lineWrap ? 'active' : ''}`}
            onClick={() => setLineWrap(!lineWrap)}
            title={lineWrap ? 'Disable Line Wrap' : 'Enable Line Wrap'}
          >
            <WrapText size={13} />
            <span>Wrap</span>
          </button>

          <button
            type="button"
            className="pane-tool-btn"
            onClick={handleCopy}
            title="Copy Raw Markdown"
          >
            {copied ? (
              <>
                <Check size={13} className="text-success" />
                <span className="text-success">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="pane-body editor-body">
        <CodeMirror
          value={value}
          height="100%"
          theme="dark"
          extensions={extensions}
          onChange={onChange}
          onCreateEditor={(view) => {
            if (editorRef) {
              editorRef.current = view;
            }
          }}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true
          }}
          className="codemirror-full-height"
        />
      </div>
    </div>
  );
}
