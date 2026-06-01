'use client'
import React, { useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { MarkdownStyle } from '../editor/markdown/utils';
import { CodeBlock } from '../editor/markdown/components/CodeBlock';
import { extractTocFromContent, type TocItem } from '@/lib/docs/toc';

interface NotePageContentProps {
  content: string;
  theme: 'light' | 'dark';
  onTocReady?: (items: TocItem[]) => void;
}

export function NotePageContent({ content, theme, onTocReady }: NotePageContentProps) {
  const tocItems = useMemo(() => extractTocFromContent(content), [content]);

  useEffect(() => {
    onTocReady?.(tocItems);
  }, [tocItems, onTocReady]);

  useEffect(() => {
    MarkdownStyle.getMarkdownStyle({ theme })
  }, [theme])

  return (
    <div className="text-foreground mb-12">
      <div className="prose min-h-[50vh] prose-slate max-w-none
        [&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:border [&_:not(pre)>code]:border-border/60 [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.875em] [&_:not(pre)>code]:font-medium
        [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm
        [&_thead]:border-b [&_thead]:border-border [&_thead]:bg-muted/50
        [&_th]:h-10 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:align-middle [&_th]:font-medium [&_th]:text-foreground [&_th]:border [&_th]:border-border
        [&_td]:px-4 [&_td]:py-3 [&_td]:align-middle [&_td]:border [&_td]:border-border [&_td]:text-sm
        [&_tbody_tr:nth-child(even)]:bg-muted/30
        [&_tbody_tr]:border-b [&_tbody_tr]:border-border
      "
        style={{ contentVisibility: "auto", containIntrinsicSize: "auto 2000px" } as React.CSSProperties}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeSlug]}
          components={{
            p: ({ className, ...props }) => <p className={`my-4 leading-relaxed ${className || ''}`} {...props} />,
            h1: ({ className, ...props }) => <h1 className={`text-3xl font-bold mt-8 mb-4 scroll-mt-24 ${className || ''}`} {...props} />,
            h2: ({ className, ...props }) => <h2 className={`text-2xl font-bold mt-8 mb-3 scroll-mt-24 ${className || ''}`} {...props} />,
            h3: ({ className, ...props }) => <h3 className={`text-xl font-bold mt-6 mb-2 scroll-mt-24 ${className || ''}`} {...props} />,
            code: ({ className, ...props }) => {
              const isInlineCode = !className?.includes('language');
              return (
                <code
                  className={`font-mono ${isInlineCode ? '' : className}`}
                  {...props}
                />
              );
            },
            pre: ({ className, ...props }) => {
              const children = props.children;
              return <CodeBlock className={`p-2 ${className}`}>{children}</CodeBlock>;
            },
            table: ({ ...props }) => (
              <div className="not-prose my-6 w-full overflow-x-auto rounded-lg border border-border shadow-sm">
                <table data-slot="table" className="w-full caption-bottom text-sm" {...props} />
              </div>
            ),
            thead: ({ ...props }) => <thead data-slot="table-head" className="[&_tr]:border-b" {...props} />,
            tbody: ({ ...props }) => <tbody data-slot="table-body" className="[&_tr:last-child]:border-0" {...props} />,
            tr: ({ ...props }) => <tr data-slot="table-row" className="border-b transition-colors hover:bg-muted/50" {...props} />,
            th: ({ ...props }) => <th data-slot="table-head" className="h-10 px-4 py-3 text-left align-middle font-medium text-foreground border border-border" {...props} />,
            td: ({ ...props }) => <td data-slot="table-cell" className="px-4 py-3 align-middle text-sm border border-border" {...props} />,

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
