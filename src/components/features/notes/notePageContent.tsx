'use client'
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { MarkdownStyle } from '../editor/markdown/utils';
import { CodeBlock } from '../editor/markdown/components/CodeBlock';
import type { TocItem } from '@/lib/docs/toc';

interface NotePageContentProps {
  content: string;
  theme: 'light' | 'dark';
  onTocReady?: (items: TocItem[]) => void;
}

export function NotePageContent({ content, theme, onTocReady }: NotePageContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const headings = Array.from(
        contentRef.current?.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]") ?? []
      );
      const tocItems = headings
        .map((heading) => ({
          id: heading.id,
          title: heading.textContent?.trim() ?? "",
          level: Number(heading.tagName.slice(1)) as 2 | 3,
        }))
        .filter((item): item is TocItem => Boolean(item.id && item.title && (item.level === 2 || item.level === 3)));

      onTocReady?.(tocItems);
    });

    return () => cancelAnimationFrame(frameId);
  }, [content, onTocReady]);

  useEffect(() => {
    MarkdownStyle.getMarkdownStyle({ theme })
  }, [theme])

  return (
    <div className="text-foreground mb-12 max-w-[75ch]">
      <div
        ref={contentRef}
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
