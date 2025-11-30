'use client'
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ThemePage from '@/components/ui/public/themePage';

export function NotePageHeader({ notesID }: { notesID: string }) {
  return (
    <header className="sticky top-0 z-30 border-b shadow-sm backdrop-blur-sm transition-all duration-300 bg-white/90 border-[#EDEFF2] dark:bg-gray-900/90 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href={`/notes/${notesID}`}
          className="flex items-center transition-colors text-[#8A94A6] hover:text-[#4A6FA5] dark:text-gray-400 dark:hover:text-blue-400"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          <span>返回列表</span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemePage />
        </div>
      </div>
    </header>
  );
}

