# Markdown 编辑器代码整理

## 目录结构

```
editor/
├── markdown/
│   ├── components/
│   │   ├── StatusBar.tsx          # 状态栏组件，显示字数统计等信息
│   │   ├── ToolbarButton.tsx      # 工具栏按钮组件
│   │   ├── markdownPreview.tsx    # Markdown 预览组件
│   │   └── showToolbar.tsx        # 工具栏显示组件
│   ├── markdownEditor.tsx         # 主编辑器组件
│   ├── type.ts                    # 类型定义文件
│   └── utils.ts                   # 工具函数
```

## 1. 主编辑器组件 - markdownEditor.tsx

```tsx
'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import {
  Bold,
  Italic,
  Heading,
  List,
  ListOrdered,
  Code,
  Quote,
  Link,
  Minus,
  Eye,
  Columns,
  Type,
} from 'lucide-react';

import { MarkdownEditorLayoutProps, EditorMode, insertTextAtCursorType, ToolbarItem } from './type';
import { calculateWordCount, calculateCharCount, getLanguageFromExtension } from './utils';
import StatusBar from './components/StatusBar';
import { ShowToolbar } from './components/showToolbar';
import { MarkdownStyle } from '@/lib/store/cdn/markdown/markdown_style';

export default function MarkdownEditor({
  initialContent = "开始你的写作吧...",
  value = '',
  onSave,
  onChange,
  showToolbar = true,
  showStatusBar = true,
  initialMode = 'edit',
  theme = 'light',
}: MarkdownEditorLayoutProps) {

  // 状态管理
  const [content, setContent] = useState<string>(value);

  // 编辑器模式（编辑/预览/分屏）
  const [editorMode, setEditorMode] = useState<EditorMode>(initialMode);

  // 全屏状态
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // 字数统计和字符数统计
  const [wordCount, setWordCount] = useState<number>(0);

  // 字符数统计
  const [charCount, setCharCount] = useState<number>(0);

  // 撤销/重做状态
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>(null);
  const isScrollingRef = useRef<boolean>(false);
  const isUndoingOrRedoingRef = useRef<boolean>(false);

  const markdownComponents = useMemo(() => ({
    h1: ({ ...props }) => <h1 {...props} className="text-2xl font-bold" />,
    h2: ({ ...props }) => <h2 {...props} className="text-xl font-semibold" />,
    h3: ({ ...props }) => <h3 {...props} className="text-lg font-medium" />,
    h4: ({ ...props }) => <h4 {...props} className="text-md font-medium" />,
    h5: ({ ...props }) => <h5 {...props} className="text-sm font-medium" />,
    strong: ({ ...props }) => <strong {...props} className="font-bold" />,
    em: ({ ...props }) => <em {...props} className="italic" />,
  }), []);

  // 处理内容更新并维护历史记录
  const handleContentChange = useCallback((newContent: string) => {
    if (isUndoingOrRedoingRef.current) {
      setContent(newContent);
      return;
    }

    setContent(newContent);

    setHistoryIndex((prevIndex) => prevIndex + 1);
  }, [historyIndex]);

  // 切换编辑器模式
 useEffect(() => {
    MarkdownStyle.getMarkdownStyle({theme})
  }, [theme])



  // 防抖的字数统计和内容变化回调
  useEffect(() => {
    const words = calculateWordCount(content);
    const chars = calculateCharCount(content);

    setWordCount(words);
    setCharCount(chars);

    // 防抖处理内容变化回调
    if (onChange) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        onChange(content);
      }, 300);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, onChange]);
  
  // 同步滚动功能
  const handleEditorScroll = useCallback(() => {
    if (isScrollingRef.current || !previewRef.current || editorMode !== 'split') return;

    try {
      isScrollingRef.current = true;
      const textarea = textareaRef.current;
      if (!textarea) return;

      const editorScroll = textarea.scrollTop;
      const editorHeight = textarea.scrollHeight - textarea.clientHeight;
      const previewScrollRatio = editorScroll / editorHeight;

      const preview = previewRef.current;
      const previewHeight = preview.scrollHeight - preview.clientHeight;
      preview.scrollTop = previewHeight * previewScrollRatio;
    } finally {
      // 使用setTimeout来避免快速滚动时的竞争条件
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 10);
    }
  }, [editorMode]);


  // 处理预览区域滚动同步到编辑器
  const handlePreviewScroll = useCallback(() => {
    if (isScrollingRef.current || !textareaRef.current || editorMode !== 'split') return;

    try {
      isScrollingRef.current = true;
      const preview = previewRef.current;
      if (!preview) return;

      const previewScroll = preview.scrollTop;
      const previewHeight = preview.scrollHeight - preview.clientHeight;
      const editorScrollRatio = previewScroll / previewHeight;

      const textarea = textareaRef.current;
      const editorHeight = textarea.scrollHeight - textarea.clientHeight;
      textarea.scrollTop = editorHeight * editorScrollRatio;
    } finally {
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 10);
    }
  }, [editorMode]);

  // 监听编辑器模式变化，重置滚动状态
  useEffect(() => {
    isScrollingRef.current = false;
  }, [editorMode]);

  // 优化的插入文本函数
  const insertTextAtCursor = useCallback((prefix: string, suffix: string = '', defaultText: string = '') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = selectedText || defaultText;

    const newContent =
      content.substring(0, start) +
      prefix + newText + suffix +
      content.substring(end);

    handleContentChange(newContent);

    // 延迟设置光标位置，确保 DOM 已更新
    requestAnimationFrame(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + newText.length + suffix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
  }, [content, handleContentChange]);

  // 工具栏项生成函数
  const toolbarItems = useCallback((insertTextAtCursor: insertTextAtCursorType): ToolbarItem[] => {
    return [
      {
        icon: <Bold size={18} />,
        title: '粗体',
        action: () => insertTextAtCursor('**', '**', '粗体文字')
      },
      {
        icon: <Italic size={18} />,
        title: '斜体',
        action: () => insertTextAtCursor('*', '*', '斜体文字')
      },
      {
        icon: <Heading size={18} />,
        title: '标题',
        action: () => insertTextAtCursor('# ', '', '标题')
      },
      {
        icon: <List size={18} />,
        title: '无序列表',
        action: () => insertTextAtCursor('- ', '', '列表项')
      },
      {
        icon: <ListOrdered size={18} />,
        title: '有序列表',
        action: () => insertTextAtCursor('1. ', '', '列表项')
      },
      {
        icon: <Quote size={18} />,
        title: '引用',
        action: () => insertTextAtCursor('> ', '', '引用文字')
      },
      {
        icon: <Code size={18} />,
        title: '代码块',
        action: () => insertTextAtCursor('```\n', '\n```', 'const code = "example";')
      },
      {
        icon: <Link size={18} />,
        title: '链接',
        action: () => insertTextAtCursor('[', '](https://example.com)', '链接文字')
      },
      {
        icon: <Minus size={18} />,
        title: '分割线',
        action: () => insertTextAtCursor('\n---\n')
      }
    ];
  }, []);

  // 预定义的工具栏动作
  const toolbarActions = useMemo(() => toolbarItems(insertTextAtCursor), [insertTextAtCursor]);

  // 模式切换按钮
  const modeButtons = useMemo(() => [
    {
      id: 'edit' as EditorMode,
      icon: <Type size={18} />,
      label: '编辑',
      title: '编辑模式'
    },
    {
      id: 'split' as EditorMode,
      icon: <Columns size={18} />,
      label: '分栏',
      title: '分栏预览'
    },
    {
      id: 'preview' as EditorMode,
      icon: <Eye size={18} />,
      label: '预览',
      title: '预览模式'
    }
  ], []);

  // 处理保存
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(content);
    } else {
      console.log('未定义保存函数');
    }
  }, [content, onSave]);

  // 全屏切换
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    
    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // 文件下载
  const handleFileDownload = useCallback(() => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content]);

  // 文件上传
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text);
    };
    reader.readAsText(file);
    
    // 重置文件输入以允许再次选择同一文件
    event.target.value = '';
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col h-full border rounded-lg overflow-hidden ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-700 text-gray-100' 
          : 'bg-white border-gray-200 text-gray-800'
      }`}
    >
      {/* 工具栏 */}
      {showToolbar && (
        <ShowToolbar
          onSave={handleSave}
          onFileDownload={handleFileDownload}
          onFileUpload={handleFileUpload}
          toolbarActions={toolbarActions}
          modeButtons={modeButtons}
          editorMode={editorMode}
          setEditorMode={setEditorMode}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          theme={theme}
        />
      )}

      {/* 编辑/预览区域 */}
      <div className="flex flex-1 min-h-0 overflow-auto">
        {/* 编辑区域 */}
        {(editorMode === 'edit' || editorMode === 'split') && (
          <div className={`flex-1 ${editorMode === 'split' ? 'w-1/2' : 'w-full'}
           overflow-auto h-full`}>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onScroll={handleEditorScroll}
              className={`w-full h-[97%] p-6 resize-none outline-none font-mono text-base leading-relaxed ${theme === 'dark'
                ? 'bg-gray-900 text-gray-100 placeholder-gray-500'
                : 'bg-gray-50 text-gray-800 placeholder-gray-400'
                }`}
              placeholder={initialContent}
              spellCheck="true"
              aria-label="Markdown 编辑器"
            />
          </div>
        )}

        {/* 分割线 */}
        {editorMode === 'split' && (
          <div className="relative w-px bg-gray-100 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-400 cursor-col-resize">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-10 bg-gray-400 dark:bg-gray-600 rounded-full" />
          </div>
        )}

        {/* 预览区域 */}
        {(editorMode === 'preview' || editorMode === 'split') && (
          <div className={`flex-1 ${editorMode === 'split' ? 'w-1/2' : 'w-full'}
           overflow-auto scrollbar-hide`}>
            <div
              ref={previewRef}
              onScroll={handlePreviewScroll}
              className={`h-full overflow-auto p-6 scrollbar-hide prose prose-lg max-w-none ${theme === 'dark'
                 ? ' prose-invert bg-gray-900'
                 : 'bg-white'
                 }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={markdownComponents}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* 状态栏 */}
      {showStatusBar && (
        <StatusBar
          wordCount={wordCount}
          charCount={charCount}
          theme={theme}
        />
      )}
    </div>
  );
}

## 2. 类型定义 - type.ts

```ts
// 编辑器模式类型定义
export type EditorMode = 'edit' | 'preview' | 'split';

// Markdown编辑器布局属性接口
export interface MarkdownEditorLayoutProps {
  initialContent?: string;
  value?: string;
  onSave?: (content: string) => void;
  onChange?: (content: string) => void;
  showToolbar?: boolean;
  showStatusBar?: boolean;
  initialMode?: EditorMode;
  theme?: 'light' | 'dark';
}

// 插入文本函数类型定义
export interface insertTextAtCursorType {
  (prefix: string, suffix?: string, defaultText?: string): void;
}

// 工具栏项接口
export interface ToolbarItem {
  icon: React.ReactNode;
  title: string;
  action: () => void;
}
```

## 3. 工具函数 - utils.ts

```ts
// 文件扩展名到编程语言的映射
export const fileExtensionToLanguage: Record<string, string> = {
  // 前端技术栈
  'js': 'javascript',
  'jsx': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'html': 'html',
  'css': 'css',
  'scss': 'scss',
  'sass': 'sass',
  'less': 'less',
  'json': 'json',
  'xml': 'xml',
  
  // 后端技术栈
  'py': 'python',
  'java': 'java',
  'cpp': 'cpp',
  'c': 'c',
  'cs': 'csharp',
  'php': 'php',
  'rb': 'ruby',
  'go': 'go',
  'rs': 'rust',
  'swift': 'swift',
  'kt': 'kotlin',
  'scala': 'scala',
  
  // 数据和配置文件
  'sql': 'sql',
  'yml': 'yaml',
  'yaml': 'yaml',
  'toml': 'toml',
  'ini': 'ini',
  'csv': 'csv',
  'tsv': 'tsv',
  
  // 其他文件类型
  'md': 'markdown',
  'markdown': 'markdown',
  'txt': 'text',
  'log': 'log',
  'sh': 'bash',
  'bash': 'bash',
  'zsh': 'zsh',
  'pl': 'perl',
  'pm': 'perl',
  'r': 'r',
  'lua': 'lua',
  'dart': 'dart',
  'dockerfile': 'dockerfile',
  'env': 'env'
};

// 计算字数的函数
export function calculateWordCount(text: string): number {
  // 移除所有空格和换行符，然后按空格分割
  const words = text.trim().replace(/\s+/g, ' ').split(' ');
  return words.length > 0 && words[0] !== '' ? words.length : 0;
}

// 计算字符数的函数（不包括空格和换行符）
export function calculateCharCount(text: string): number {
  // 移除所有空格和换行符
  const textWithoutSpaces = text.replace(/\s/g, '');
  return textWithoutSpaces.length;
}

// 从文件扩展名获取编程语言
export function getLanguageFromExtension(extension: string): string {
  return fileExtensionToLanguage[extension.toLowerCase()] || 'text';
}

// 创建Markdown样式
export function createMarkdownStyle(): string {
  return `
    .markdown-body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .markdown-body h1,
    .markdown-body h2,
    .markdown-body h3,
    .markdown-body h4,
    .markdown-body h5,
    .markdown-body h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }
    .markdown-body h1 {
      padding-bottom: 0.3em;
      font-size: 2em;
      border-bottom: 1px solid #eaecef;
    }
    .markdown-body h2 {
      padding-bottom: 0.3em;
      font-size: 1.5em;
      border-bottom: 1px solid #eaecef;
    }
    .markdown-body h3 {
      font-size: 1.25em;
    }
    .markdown-body h4 {
      font-size: 1em;
    }
    .markdown-body h5 {
      font-size: 0.875em;
    }
    .markdown-body h6 {
      font-size: 0.85em;
      color: #6a737d;
    }
    .markdown-body p {
      margin-top: 0;
      margin-bottom: 10px;
    }
    .markdown-body code {
      padding: 0.2em 0.4em;
      margin: 0;
      font-size: 85%;
      background-color: rgba(27,31,35,0.05);
      border-radius: 6px;
    }
    .markdown-body pre {
      padding: 16px;
      overflow: auto;
      line-height: 1.45;
      background-color: #f6f8fa;
      border-radius: 6px;
    }
    .markdown-body pre code {
      display: inline;
      padding: 0;
      margin: 0;
      font-size: 100%;
      word-break: normal;
      white-space: pre;
      background: transparent;
      border: 0;
    }
    .markdown-body blockquote {
      padding: 0 1em;
      color: #6a737d;
      border-left: 0.25em solid #dfe2e5;
    }
    .markdown-body table {
      display: block;
      width: 100%;
      overflow: auto;
    }
    .markdown-body table th {
      font-weight: 600;
    }
    .markdown-body table th,
    .markdown-body table td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }
    .markdown-body table tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
    }
    .markdown-body table tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
    .markdown-body img {
      max-width: 100%;
      box-sizing: content-box;
      background-color: #fff;
    }
  `;
}

export const MarkdownStyle = createMarkdownStyle()
```

## 4. 组件 - components/

### 4.1 状态栏组件 - components/StatusBar.tsx

```tsx
import React from 'react';

interface StatusBarProps {
  wordCount: number;
  charCount: number;
  theme: 'light' | 'dark';
}

const StatusBar: React.FC<StatusBarProps> = ({ wordCount, charCount, theme }) => (
  <div className={`flex items-center justify-between px-4 py-2 text-sm border-t ${theme === 'dark'
    ? 'border-gray-700 bg-gray-800 text-gray-400'
    : 'border-gray-200 bg-gray-100 text-gray-600'
    }`}>
    <div className="flex items-center gap-4">
      <div>
        字数: <span className="font-semibold">{wordCount}</span>
      </div>
      <div>
        字符: <span className="font-semibold">{charCount}</span>
      </div>
    </div>
  </div>
);

export default StatusBar;
```

### 4.2 工具栏按钮组件 - components/ToolbarButton.tsx

```tsx
import React from 'react';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  theme: 'light' | 'dark';
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, title, onClick, theme }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded transition-colors ${theme === 'dark'
      ? 'hover:bg-gray-700'
      : 'hover:bg-gray-100'
      }`}
    title={title}
    aria-label={title}
  >
    {icon}
  </button>
);

export default ToolbarButton;
```

### 4.3 工具栏显示组件 - components/showToolbar.tsx

```tsx
import { Input } from "@/components/ui/shadcnComponents/calendar-17/input";
import React from "react";
import { Save, Minimize, Maximize, Download, Upload } from "lucide-react";
import { EditorMode } from "../type";
import ToolbarButton from "./ToolbarButton";

interface ToolbarAction {
  icon: React.ReactNode;
  title: string;
  action: () => void;
}

interface ModeButton {
  id: EditorMode;
  icon: React.ReactNode;
  label: string;
  title: string;
}

interface ShowToolbarProps {
  onSave: () => void;
  onFileDownload: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toolbarActions: ToolbarAction[];
  modeButtons: ModeButton[];
  editorMode: EditorMode;
  setEditorMode: (mode: EditorMode) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  theme: "light" | "dark";
}

export function ShowToolbar({
  onSave,
  onFileDownload,
  onFileUpload,
  toolbarActions,
  modeButtons,
  editorMode,
  setEditorMode,
  isFullscreen,
  toggleFullscreen,
  theme,
}: ShowToolbarProps) {

  return (
    <div className={`flex flex-wrap items-center gap-1 p-3 border-b ${theme === 'dark'
      ? 'border-gray-700 bg-gray-800'
      : 'border-gray-200 bg-white'
      }`}>
      {/* 文件操作 */}
      <div className="flex items-center gap-1 mr-2 pr-2 border-r border-gray-300 dark:border-gray-600">
        <ToolbarButton
          icon={<Save size={16} />}
          title="保存"
          onClick={onSave}
          theme={theme}
        />
        <button
          onClick={() => document.getElementById('file-upload')?.click()}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="导入文件"
          aria-label="导入文件"
        >
          <Upload size={16} />
        </button>

        <ToolbarButton
          icon={<Download size={16} />}
          title="导出文件 (Markdown格式)"
          onClick={onFileDownload}
          theme={theme}
        />
        <Input
          id="file-upload"
          type="file"
          accept=".md,.markdown,.txt,
          .js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.go,
          .rb,.php,.swift,.kt,.rs,.scala,.html,.css,.json,
          .xml,.yaml,.yml"
          className="hidden"
          onChange={onFileUpload}
        />
      </div>

      {/* 编辑工具 */}
      <div className="flex flex-wrap items-center gap-1">
        {toolbarActions.map((item, index) => (
          <React.Fragment key={item.title}>
            {index > 0 && index % 3 === 0 && (
              <div
                className={`w-px h-5 mx-1 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
              />
            )}
            <ToolbarButton
              icon={item.icon}
              title={item.title}
              onClick={item.action}
              theme={theme}
            />
          </React.Fragment>
        ))}
      </div>

      {/* 右侧工具 */}
      <div className="flex items-center gap-1 ml-auto">

        {/* 模式切换 */}
        <div className={`flex items-center rounded overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
          {modeButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => setEditorMode(button.id)}
              className={`flex items-center gap-1 px-3 py-2 transition-colors ${editorMode === button.id
                ? theme === 'dark'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-200 text-gray-800'
                : theme === 'dark'
                  ? 'hover:bg-gray-600'
                  : 'hover:bg-gray-200'
                }`}
              title={button.title}
              aria-label={button.title}
            >
              {button.icon}
              <span className="text-sm hidden sm:inline">{button.label}</span>
            </button>
          ))}
        </div>

        {/* 全屏按钮 */}
        <ToolbarButton
          icon={isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          title={isFullscreen ? '退出全屏' : '全屏'}
          onClick={toggleFullscreen}
          theme={theme}
        />
      </div>
    </div>
  )
}
```