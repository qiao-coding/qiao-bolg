'use client';

import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';

export function ContentsBackLink({ noteId, noteTitle }: { noteId: number; noteTitle: string }) {
  return (
    <Link
      href={`/notes/${noteId}`}
      className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors mb-6 text-sm"
    >
      <ArrowLeft className="w-4 h-4" />
      {noteTitle}
    </Link>
  );
}

export function ContentsPageLink({
  href,
  index,
  title,
  author,
  dateStart,
  tags,
}: {
  href: string;
  index: number;
  title: string;
  author?: string | null;
  dateStart?: string | null;
  tags?: string[];
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-6 px-2 py-3.5 border-b border-border/60
                 text-foreground no-underline
                 hover:bg-accent/30 transition-colors duration-200 group"
    >
      {/* 序号 */}
      <span className="w-8 text-right font-mono text-sm text-muted-foreground shrink-0">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* 主体 */}
      <div className="flex-1 min-w-0">
        <span className="text-base text-foreground block leading-relaxed group-hover:text-primary transition-colors">
          {title}
        </span>
        <span className="text-xs text-muted-foreground font-mono block mt-1 select-all">
          {href}
        </span>
        {(author || dateStart) && (
          <span className="text-xs text-muted-foreground/60 block mt-0.5">
            {author || ''}{author && dateStart ? ' · ' : ''}{dateStart || ''}
          </span>
        )}
      </div>

      {/* 标签 */}
      {tags && tags.length > 0 && (
        <span className="flex gap-1 shrink-0 max-w-[160px] overflow-hidden">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full
                         bg-primary/10 text-primary border border-primary/20
                         whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </span>
      )}
    </Link>
  );
}
