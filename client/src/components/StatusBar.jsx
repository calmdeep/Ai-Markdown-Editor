import React from 'react';
import { Type, AlignLeft, Hash, Clock, CheckCircle2 } from 'lucide-react';

export default function StatusBar({ stats }) {
  const { words, characters, lines, readingTimeMinutes } = stats;

  return (
    <footer className="status-bar" role="contentinfo">
      <div className="status-left">
        <div className="status-item" title="Total Word Count">
          <Type size={14} className="status-icon" />
          <span>
            <strong>{words.toLocaleString()}</strong> words
          </span>
        </div>

        <div className="status-separator" />

        <div className="status-item" title="Character Count">
          <AlignLeft size={14} className="status-icon" />
          <span>
            <strong>{characters.toLocaleString()}</strong> characters
          </span>
        </div>

        <div className="status-separator" />

        <div className="status-item" title="Total Lines">
          <Hash size={14} className="status-icon" />
          <span>
            <strong>{lines.toLocaleString()}</strong> lines
          </span>
        </div>

        <div className="status-separator" />

        <div className="status-item" title="Estimated Reading Time">
          <Clock size={14} className="status-icon" />
          <span>
            ~{readingTimeMinutes} min read
          </span>
        </div>
      </div>

      <div className="status-right">
        <div className="status-item status-live">
          <CheckCircle2 size={14} className="live-icon" />
          <span>Live Synchronized</span>
        </div>
      </div>
    </footer>
  );
}
