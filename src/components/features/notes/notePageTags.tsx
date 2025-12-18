'use client'
import Link from 'next/link';
import { NotesPage } from '@/types/note/type';

export function NotePageTags({ tags }: { tags: string[] }) {
  return (
    <div className="mt-8 pt-6 border-t transition-all duration-300 border-border">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">标签：</span>
        {tags.map((tag, index) => (
          <Link
            key={index}
            href={`/article?tag=${encodeURIComponent(tag)}`}
            className="text-sm px-3 py-1.5 rounded-full transition-all duration-300 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}

