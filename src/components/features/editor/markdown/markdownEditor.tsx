'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import {
  Eye,
  Columns,
  Type,
  Bold,
  Italic,
  Heading,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Minus,
} from 'lucide-react';

import { MarkdownEditorLayoutProps, EditorMode, insertTextAtCursorType } from './type';
import { calculateWordCount, calculateCharCount, getLanguageFromExtension, MarkdownStyle } from './utils';
import StatusBar from './components/StatusBar';
import { ShowToolbar } from './components/showToolbar';
import { CodeBlock } from './components/CodeBlock';

export default function MarkdownEditor({
  initialContent = "开始你的写作吧...",
  value = '',
  onSave,
  onChange,
  showToolbar = true,
  showStatusBar = true,
  initialMode = 'edit',
  theme = 'light',
  className = '',
  editorClass = '',
  viewClass = '',
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
  const [history, setHistory] = useState<string[]>([value || initialContent]);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>(null);
  const isScrollingRef = useRef<boolean>(false);
  const isUndoingOrRedoingRef = useRef<boolean>(false);

  const markdownComponents = useMemo(() => ({
            p: ({ className = '', ...props }) => <p className={`my-4 leading-relaxed ${className || ''}`} {...props} />,
            h1: ({ className = '', ...props }) => <h1 className={`text-3xl font-bold mt-8 mb-4 ${className || ''}`} {...props} />,
            h2: ({ className = '', ...props }) => <h2 className={`text-2xl font-bold mt-8 mb-3 ${className || ''}`} {...props} />,
            h3: ({ className = '', ...props }) => <h3 className={`text-xl font-bold mt-6 mb-2 ${className || ''}`} {...props} />,
            code: ({ className = '', ...props }) => {
              const isInlineCode = !className?.includes('language');

              return (
                <code
                  className={`font-mono ${isInlineCode
                    ? 'px-1.5 py-0.5 rounded text-sm font-medium bg-muted/80 dark:bg-muted/40'
                    : className}`}
                  {...props}
                />
              );
            },
            pre: ({ className = '', ...props }) => {
              const children = props.children;
              return <CodeBlock className={className}>{children}</CodeBlock>;
            },
            a: ({ ...props }) => <a
              className="text-[#4A6FA5] hover:text-[#3A5F95] underline decoration-1 underline-offset-2 dark:text-blue-400 dark:hover:text-blue-300"
              {...props} />
          }), []);

  // 处理内容更新并维护历史记录
  const handleContentChange = useCallback((newContent: string) => {
    if (isUndoingOrRedoingRef.current) {
      setContent(newContent);
      return;
    }

    setContent(newContent);

    // 更新历史记录
    setHistory(prevHistory => {
      // 截断历史记录到当前索引位置（防止在撤销后进行编辑时保留未来状态）
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      // 添加新内容
      newHistory.push(newContent);
      return newHistory;
    });
    setHistoryIndex(prevIndex => prevIndex + 1);
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


  // 优化的插入文本函数
  const insertTextAtCursor = useCallback((prefix: string, suffix: string = '', defaultText: string = '') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = selectedText || defaultText;

    // 检查是否已经应用了相同的格式，如果是则移除格式
    let newContent, newCursorPos;
    if (selectedText.startsWith(prefix) && selectedText.endsWith(suffix) && 
        selectedText.length >= prefix.length + suffix.length) {
      // 移除已有的格式
      const innerText = selectedText.substring(prefix.length, selectedText.length - suffix.length);
      newContent = 
        content.substring(0, start) +
        innerText +
        content.substring(end);
      // 光标位置：起始位置 + 内部文本长度
      newCursorPos = start + innerText.length;
    } else {
      // 添加新的格式
      newContent =
        content.substring(0, start) +
        prefix + newText + suffix +
        content.substring(end);
      // 光标位置：起始位置 + 前缀长度 + 新文本长度 + 后缀长度
      newCursorPos = start + prefix.length + newText.length + suffix.length;
    }

    handleContentChange(newContent);

    // 延迟设置光标位置，确保 DOM 已更新
    requestAnimationFrame(() => {
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
  }, [content, handleContentChange]);

  // 撤销
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    const previousContent = history[newIndex];
    
    isUndoingOrRedoingRef.current = true;
    setContent(previousContent);
    setHistoryIndex(newIndex);
    
    setTimeout(() => {
      isUndoingOrRedoingRef.current = false;
    }, 100);
  }, [history, historyIndex]);

  // 重做
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    const nextContent = history[newIndex];
    
    isUndoingOrRedoingRef.current = true;
    setContent(nextContent);
    setHistoryIndex(newIndex);
    
    setTimeout(() => {
      isUndoingOrRedoingRef.current = false;
    }, 100);
  }, [history, historyIndex]);

  // 键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查是否按下了 Ctrl+Z (或 Cmd+Z)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault(); // 阻止浏览器默认的撤销操作
        
        if (e.shiftKey) {
          //重做
          redo();
        } else {
          //撤销
          undo();
        }
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown);
    }

    // 清理事件监听器
    return () => {
      if (textarea) {
        textarea.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [undo, redo]);

  // 工具栏项目
  const toolbarItems = useCallback((insertTextAtCursor: insertTextAtCursorType) => {
    return [
      { icon: <Bold size={18} />, title: '粗体', action: () => insertTextAtCursor('**', '**', '粗体文字') },
      { icon: <Italic size={18} />, title: '斜体', action: () => insertTextAtCursor('*', '*', '斜体文字') },
      { icon: <Heading size={18} />, title: '标题', action: () => insertTextAtCursor('# ', '', '标题') },
      { icon: <List size={18} />, title: '无序列表', action: () => insertTextAtCursor('- ', '', '列表项') },
      { icon: <ListOrdered size={18} />, title: '有序列表', action: () => insertTextAtCursor('1. ', '', '列表项') },
      { icon: <Quote size={18} />, title: '引用', action: () => insertTextAtCursor('> ', '', '引用文字') },
      { icon: <Code size={18} />, title: '代码块', action: () => insertTextAtCursor('```\n', '\n```', 'const code = "example";') },
      { icon: <Link size={18} />, title: '链接', action: () => insertTextAtCursor('[', '](https://example.com)', '链接文字') },
      { icon: <Minus size={18} />, title: '分割线', action: () => insertTextAtCursor('\n---\n', '', '') },
    ];
  }, []);

  // 预定义的工具栏动作
  const toolbarActions = useMemo(() => toolbarItems(insertTextAtCursor), [insertTextAtCursor, toolbarItems]);

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
      localStorage.setItem('markdown-editor-content', content);
    }
  }, [content, onSave]);

  // 处理文件上传
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;

      // 从文件名提取扩展名
      const fileName = file.name;
      const extensionMatch = fileName.match(/\.([^.]+)$/);

      if (extensionMatch && extensionMatch[1]) {
        const extension = extensionMatch[1];
        const language = getLanguageFromExtension(extension);

        // 如果找到对应的语言标识，则将内容包装在代码块中
        if (language) {
          const formattedContent = `\`\`\`${language}\n${text}\n\`\`\``;
          handleContentChange(formattedContent);
          return;
        }
      }

      // 对于不识别的文件类型或Markdown文件，直接设置原始内容
      handleContentChange(text);
    };
    reader.readAsText(file);
  }, [handleContentChange]);

  // 处理文件下载
  const handleFileDownload = useCallback(() => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content]);

  // 处理全屏切换
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col  h-full transition-colors duration-200 
        ${isFullscreen ? 'fixed inset-0 z-50' : ''}
        ${theme === 'dark'
          ? 'bg-gray-900 text-gray-100'
          : 'bg-gray-50 text-gray-800'
        }
        ${className} `}
    >
      {/* 工具栏 */}
      {showToolbar && <ShowToolbar
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
       />}

      {/* 编辑器主体 */}
      <div className="flex flex-1 overflow-hidden ">
        {/* 编辑区域 */}
        {(editorMode === 'edit' || editorMode === 'split') && (
          <div className={`flex-1 ${editorMode === 'split' ? 'w-1/2' : 'w-full'}
           overflow-auto h-full`}>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onScroll={handleEditorScroll}
              className={`w-full h-[98.8%] p-6 resize-none outline-none
                 font-mono text-sm leading-relaxed ${theme === 'dark'
                ? 'bg-gray-900 text-gray-100 placeholder-gray-500'
                : 'bg-gray-50 text-gray-800 placeholder-gray-400'
                
                }  ${editorClass}`}
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
                }  ${viewClass}`}
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
      {showStatusBar && <StatusBar wordCount={wordCount} charCount={charCount} theme={theme} />}
    </div>
  )
}