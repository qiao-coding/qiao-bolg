'use client'
import React, { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Check, Copy, ChevronRight } from 'lucide-react';
import { MarkdownStyle } from '../editor/markdown/utils';
import { CodeBlock } from '../editor/markdown/components/CodeBlock';



// 定义组件props接口
export function NotePageContent({ content, theme }: { content: string; theme: 'light' | 'dark' }) {


  // 加载markdown样式
  useEffect(() => {
    MarkdownStyle.getMarkdownStyle({theme})
  }, [theme])




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