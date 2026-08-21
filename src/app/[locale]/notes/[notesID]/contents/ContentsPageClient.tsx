'use client';

import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function ContentsBackLink({ noteId, noteTitle }: { noteId: number; noteTitle: string }) {
  return (
    <Link
      href={`/notes/${noteId}`}
      className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/76 px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm transition-colors hover:text-brand-pink-deep dark:border-[#8fb7df]/24 dark:bg-[#26334d] dark:text-[#dbe9f8]"
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
  const router = useRouter();
  const pathname = usePathname();
  const pendingRefreshPath = useRef<string | null>(null);

  useEffect(() => {
    if (
      pendingRefreshPath.current &&
      (pathname === pendingRefreshPath.current || pathname.endsWith(pendingRefreshPath.current))
    ) {
      pendingRefreshPath.current = null;
      router.refresh();
    }
  }, [pathname, router]);

  return (
    <Link
      href={href}
      prefetch={false}
      onClick={() => {
        pendingRefreshPath.current = href;
      }}
      className="group flex items-center gap-5 px-2 py-4 text-foreground no-underline transition-colors duration-200 hover:bg-white/55 dark:hover:bg-[#26334d]"
    >
      {/* 序号 */}
      <span className="w-10 shrink-0 text-center font-mono text-sm text-muted-foreground">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* 主体 */}
      <div className="flex-1 min-w-0">
        <span className="block text-base font-semibold leading-relaxed text-foreground transition-colors group-hover:text-brand-pink-deep">
          {title}
        </span>
        <span className="mt-1 block select-all font-mono text-xs text-muted-foreground">
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
              className="whitespace-nowrap rounded-md border border-brand-pink/15 bg-brand-pink-soft/45 px-2 py-0.5 text-[10px] text-brand-pink-deep dark:border-[#8fb7df]/20 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]"
            >
              {tag}
            </span>
          ))}
        </span>
      )}
    </Link>
  );
}
