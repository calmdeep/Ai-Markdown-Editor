import React, { useState } from 'react';
import { Eye, Copy, Check, ShieldCheck, Printer } from 'lucide-react';

export default function PreviewPane({ htmlContent }) {
  const [copied, setCopied] = useState(false);

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy HTML:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pane-container preview-pane">
      <div className="pane-header">
        <div className="pane-header-left">
          <Eye size={15} className="pane-icon" />
          <span className="pane-title">Live Preview</span>
          <span className="pane-tag badge-sanitized" title="Sanitized securely with DOMPurify">
            <ShieldCheck size={12} />
            <span>Sanitized</span>
          </span>
        </div>

        <div className="pane-header-right">
          <button
            type="button"
            className="pane-tool-btn"
            onClick={handlePrint}
            title="Print or Save as PDF"
          >
            <Printer size={13} />
            <span>Print</span>
          </button>

          <button
            type="button"
            className="pane-tool-btn"
            onClick={handleCopyHtml}
            title="Copy Rendered HTML"
          >
            {copied ? (
              <>
                <Check size={13} className="text-success" />
                <span className="text-success">Copied HTML!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy HTML</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="pane-body preview-body">
        {htmlContent ? (
          <div
            className="markdown-rendered-view"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <div className="preview-empty-state">
            <div className="empty-icon-circle">
              <Eye size={24} />
            </div>
            <h3>Nothing to preview</h3>
            <p>Start typing in the editor to see your formatted Markdown appear in real time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
