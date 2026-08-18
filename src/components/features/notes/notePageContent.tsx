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
    <div className="text-foreground mb-12 max-w-[75ch]">
      <div
        className="markdown-body min-h-[50vh] max-w-none"
        style={{ contentVisibility: "auto", containIntrinsicSize: "auto 2000px" } as React.CSSProperties}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeSlug]}
          components={{
            pre: ({ className, ...props }) => (
              <CodeBlock className={className}>{props.children}</CodeBlock>
            ),
            table: ({ ...props }) => (
              <div className="my-6 w-full overflow-x-auto rounded-lg border border-border shadow-sm">
                <table data-slot="table" className="w-full caption-bottom text-sm" {...props} />
              </div>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
