'use client'
import Link from 'next/link';
import { NotesPage } from '@/types/note/type';

export function NotePageTags({ tags }: { tags: string[] }) {
  return (
    <div className="mt-8 pt-6 border-t transition-all duration-300 border-[#EDEFF2] dark:border-gray-700">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-[#8A94A6] dark:text-gray-400">标签：</span>
        {tags.map((tag, index) => (
          <Link
            key={index}
            href={`/article?tag=${encodeURIComponent(tag)}`}
            className="text-sm px-3 py-1.5 rounded-full transition-all duration-300 bg-[#E9EEF6] text-[#4A6FA5] hover:bg-[#D9E2EC] hover:shadow-sm dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 dark:hover:shadow-sm"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}

