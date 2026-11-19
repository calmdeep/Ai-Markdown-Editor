import React from 'react';
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
  RotateCcw,
  Trash2,
  Columns2,
  Edit3,
  Eye
} from 'lucide-react';

export default function Toolbar({
  onInsert,
  onResetSample,
  onClear,
  viewMode,
  setViewMode
}) {
  const tools = [
    {
      category: 'format',
      items: [
        {
          label: 'Heading 1',
          icon: <Heading1 size={17} />,
          action: () => onInsert('# ', '', 'Heading 1')
        },
        {
          label: 'Heading 2',
          icon: <Heading2 size={17} />,
          action: () => onInsert('## ', '', 'Heading 2')
        },
        {
          label: 'Heading 3',
          icon: <Heading3 size={17} />,
          action: () => onInsert('### ', '', 'Heading 3')
        },
        {
          label: 'Bold',
          icon: <Bold size={17} />,
          action: () => onInsert('**', '**', 'bold text')
        },
        {
          label: 'Italic',
          icon: <Italic size={17} />,
          action: () => onInsert('*', '*', 'italic text')
        },
        {
          label: 'Strikethrough',
          icon: <Strikethrough size={17} />,
          action: () => onInsert('~~', '~~', 'strikethrough')
        }
      ]
    },
    {
      category: 'blocks',
      items: [
        {
          label: 'Quote',
          icon: <Quote size={17} />,
          action: () => onInsert('> ', '', 'Quoted text')
        },
        {
          label: 'Code Block',
          icon: <Code size={17} />,
          action: () => onInsert('```javascript\n', '\n```', '// your code here')
        },
        {
          label: 'Bullet List',
          icon: <List size={17} />,
          action: () => onInsert('- ', '', 'List item')
        },
        {
          label: 'Numbered List',
          icon: <ListOrdered size={17} />,
          action: () => onInsert('1. ', '', 'Numbered item')
        },
        {
          label: 'Task List',
          icon: <CheckSquare size={17} />,
          action: () => onInsert('- [ ] ', '', 'Task item')
        },
        {
          label: 'Insert Link',
          icon: <LinkIcon size={17} />,
          action: () => onInsert('[', '](https://example.com)', 'Link description')
        },
        {
          label: 'Insert Table',
          icon: <TableIcon size={17} />,
          action: () =>
            onInsert(
              '\n| Header 1 | Header 2 | Header 3 |\n| :--- | :---: | ---: |\n| Cell 1 | Cell 2 | Cell 3 |\n',
              '',
              ''
            )
        },
        {
          label: 'Horizontal Rule',
          icon: <Minus size={17} />,
          action: () => onInsert('\n---\n\n', '', '')
        }
      ]
    }
  ];

  return (
    <div className="toolbar-container" role="toolbar" aria-label="Markdown formatting toolbar">
      <div className="toolbar-left">
        {tools.map((group, groupIdx) => (
          <React.Fragment key={groupIdx}>
            <div className="toolbar-group">
              {group.items.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="toolbar-btn"
                  title={item.label}
                  aria-label={item.label}
                  onClick={item.action}
                >
                  {item.icon}
                </button>
              ))}
            </div>
            {groupIdx < tools.length - 1 && <div className="toolbar-divider" />}
          </React.Fragment>
        ))}

        <div className="toolbar-divider" />

        {/* Document action helpers */}
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            title="Load Sample Document"
            aria-label="Load Sample Document"
            onClick={onResetSample}
          >
            <RotateCcw size={16} />
            <span className="btn-text">Sample</span>
          </button>
          <button
            type="button"
            className="toolbar-btn toolbar-btn-danger"
            title="Clear Editor"
            aria-label="Clear Editor"
            onClick={onClear}
          >
            <Trash2 size={16} />
            <span className="btn-text">Clear</span>
          </button>
        </div>
      </div>

      {/* View layout toggles */}
      <div className="toolbar-right">
        <div className="view-mode-selector">
          <button
            type="button"
            className={`view-btn ${viewMode === 'split' ? 'active' : ''}`}
            title="Split View (Editor & Preview)"
            aria-label="Split View"
            onClick={() => setViewMode('split')}
          >
            <Columns2 size={16} />
            <span>Split</span>
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === 'editor' ? 'active' : ''}`}
            title="Editor Only"
            aria-label="Editor Only"
            onClick={() => setViewMode('editor')}
          >
            <Edit3 size={16} />
            <span>Editor</span>
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === 'preview' ? 'active' : ''}`}
            title="Preview Only"
            aria-label="Preview Only"
            onClick={() => setViewMode('preview')}
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
}
