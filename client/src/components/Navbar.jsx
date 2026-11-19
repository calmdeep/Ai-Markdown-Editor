import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Code2,
  Columns2,
  Eye,
  RotateCcw,
  Trash2,
  ChevronDown,
  Edit2,
  Check
} from 'lucide-react';

export default function Navbar({
  documentTitle,
  onTitleChange,
  viewMode,
  setViewMode,
  onDownloadMd,
  onDownloadHtml,
  onResetSample,
  onClear
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const titleInputRef = useRef(null);
  const exportMenuRef = useRef(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  // Click outside listener for export menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar-container" role="banner">
      {/* 1. Left: Brand & Document Title */}
      <div className="navbar-left">
        <div className="navbar-brand">
          <div className="brand-badge-icon">
            <Sparkles size={17} className="brand-glow-icon" />
          </div>
          <div className="brand-text-block">
            <span className="brand-title">MarkFlow<span className="brand-accent">.ai</span></span>
            <span className="brand-tag">v2.0 Pro</span>
          </div>
        </div>

        <div className="navbar-divider" />

        {/* Editable Document Title */}
        <div className="doc-title-wrapper">
          {isEditingTitle ? (
            <div className="title-edit-form">
              <input
                ref={titleInputRef}
                type="text"
                className="title-input"
                value={documentTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    setIsEditingTitle(false);
                  }
                }}
              />
              <button
                type="button"
                className="title-save-btn"
                onClick={() => setIsEditingTitle(false)}
                title="Save title"
              >
                <Check size={13} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="title-display-btn"
              onClick={() => setIsEditingTitle(true)}
              title="Click to rename document"
            >
              <FileText size={14} className="title-doc-icon" />
              <span className="doc-title-text">{documentTitle}</span>
              <Edit2 size={12} className="title-edit-hint" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Center: Segmented Layout Controls */}
      <div className="navbar-center">
        <div className="segmented-control" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'editor'}
            className={`segmented-btn ${viewMode === 'editor' ? 'active' : ''}`}
            onClick={() => setViewMode('editor')}
            title="Editor View Only"
          >
            <Code2 size={14} />
            <span>Editor</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'split'}
            className={`segmented-btn ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => setViewMode('split')}
            title="Split-Screen View (Side-by-Side)"
          >
            <Columns2 size={14} />
            <span>Split View</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'preview'}
            className={`segmented-btn ${viewMode === 'preview' ? 'active' : ''}`}
            onClick={() => setViewMode('preview')}
            title="Preview Only"
          >
            <Eye size={14} />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* 3. Right: Engine Badge & Actions */}
      <div className="navbar-right">
        <div className="engine-status-pill" title="AI Service Status: Active">
          <span className="status-dot-pulse" />
          <span className="engine-label">Gemini 2.5 Flash</span>
        </div>

        <div className="navbar-divider" />

        <div className="quick-actions-group">
          <button
            type="button"
            className="nav-icon-btn"
            onClick={onResetSample}
            title="Load Sample Document"
          >
            <RotateCcw size={15} />
          </button>
          <button
            type="button"
            className="nav-icon-btn nav-icon-danger"
            onClick={onClear}
            title="Clear Editor"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Export Dropdown */}
        <div className="export-dropdown-wrapper" ref={exportMenuRef}>
          <button
            type="button"
            className="btn btn-export"
            onClick={() => setShowExportMenu(!showExportMenu)}
          >
            <Download size={14} />
            <span>Export</span>
            <ChevronDown size={13} className={`chevron ${showExportMenu ? 'rotated' : ''}`} />
          </button>

          {showExportMenu && (
            <div className="export-menu-dropdown">
              <button
                type="button"
                className="export-menu-item"
                onClick={() => {
                  setShowExportMenu(false);
                  onDownloadMd();
                }}
              >
                <div className="export-item-icon">.md</div>
                <div className="export-item-info">
                  <span className="export-item-title">Markdown File</span>
                  <span className="export-item-sub">Plaintext with syntax</span>
                </div>
              </button>
              <button
                type="button"
                className="export-menu-item"
                onClick={() => {
                  setShowExportMenu(false);
                  onDownloadHtml();
                }}
              >
                <div className="export-item-icon html-icon">&lt;/&gt;</div>
                <div className="export-item-info">
                  <span className="export-item-title">HTML Webpage</span>
                  <span className="export-item-sub">Ready to publish styled doc</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
