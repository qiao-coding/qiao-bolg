'use client'
import React, { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Check, Copy, ChevronRight } from 'lucide-react';

import { MarkdownStyle } from '@/lib/store/cdn/markdown/markdown_style';


// 定义组件props接口
export function NotePageContent({ content, theme }: { content: string; theme: 'light' | 'dark' }) {


  // 加载markdown样式
  useEffect(() => {
    MarkdownStyle.getMarkdownStyle({theme})
  }, [theme])







  const CodeBlock = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const [copied, setCopied] = useState(false);

    // 提取语言类型
    const language = React.isValidElement(children)
      ? ((children as React.ReactElement)
        .props as { className?: string })
        .className?.match(/language-([\w-]+)/)?.[1] || 'text'
      : 'text';

    // 处理复制代码
    const handleCopy = useCallback(() => {
      const getTextContent = (node: React.ReactNode): string => {
        if (typeof node === 'string') {
          return node;
        }
        if (Array.isArray(node)) {
          return node.map(getTextContent).join('');
        }

        if (React.isValidElement(node) && node.props) {
          return getTextContent((node.props as React.PropsWithChildren).children);
        }

        return '';
      };

      const codeText = getTextContent(children);

      if (codeText) {
        // 复制代码到剪贴板
        navigator.clipboard.writeText(codeText).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
          console.error('复制失败:', err);
        });
      }
    }, [children]);

    // 语言显示名称映射
    const languageDisplayNames: Record<string, string> = {
      js: 'JavaScript',
      ts: 'TypeScript',
      py: 'Python',
      java: 'Java',
      cpp: 'C++',
      csharp: 'C#',
      go: 'Go',
      rs: 'Rust',
      sql: 'SQL',
      html: 'HTML',
      css: 'CSS',
      json: 'JSON',
      yaml: 'YAML',
      md: 'Markdown',
      text: 'Text'
    };

    const displayLanguage = languageDisplayNames[language] || language.charAt(0).toUpperCase() + language.slice(1);

    return (
      <div className="relative group my-6 overflow-hidden rounded-lg border border-border">
        <div className={`flex justify-between items-center px-4 py-2 bg-muted/90 dark:bg-muted/90 border-b border-border`}>
          {/* 语言标签 */}
          <div className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className={`text-xs font-medium font-mono capitalize text-muted-foreground`}>
              {displayLanguage}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-secondary hover:bg-secondary/80 rounded-md px-2.5 py-1 text-xs font-medium text-secondary-foreground flex items-center gap-1.5"
            aria-label="复制代码"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>复制</span>
              </>
            )}
          </button>
        </div>
        <div className="bg-background dark:bg-slate-900">
          <pre className={`overflow-x-auto text-sm  leading-relaxed m-0 !bg-transparent ${className || ''}`}>
            {children}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="text-foreground mb-12">
      <div className="prose min-h-[50vh] prose-slate max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[[rehypeHighlight]]}
          components={{
            p: ({ className, ...props }) => <p className={`my-4 leading-relaxed ${className || ''}`} {...props} />,
            h1: ({ className, ...props }) => <h1 className={`text-3xl font-bold mt-8 mb-4 ${className || ''}`} {...props} />,
            h2: ({ className, ...props }) => <h2 className={`text-2xl font-bold mt-8 mb-3 ${className || ''}`} {...props} />,
            h3: ({ className, ...props }) => <h3 className={`text-xl font-bold mt-6 mb-2 ${className || ''}`} {...props} />,
            code: ({ className, ...props }) => {
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
            pre: ({ className, ...props }) => {
              const children = props.children;
              return <CodeBlock className={className}>{children}</CodeBlock>;
            },
            a: ({ ...props }) => <a
              className="text-[#4A6FA5] hover:text-[#3A5F95] underline decoration-1 underline-offset-2 dark:text-blue-400 dark:hover:text-blue-300"
              {...props} />
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}