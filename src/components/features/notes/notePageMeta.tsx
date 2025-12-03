'use client'
import { Calendar, Clock } from 'lucide-react';
import { NotesPage } from '@/types/note/type';

export function NotePageMeta({ notesPage }: { notesPage: NotesPage }) {
  return (
    <div className="mb-8 text-[#2D3748] dark:text-gray-100">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight animate-fade-in">
        {notesPage.title}
      </h1>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <div className="flex items-center gap-1.5 text-[#8A94A6] dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          发布于{notesPage.dateStart}
        </div>
        <div className="flex items-center gap-1.5 text-[#8A94A6] dark:text-gray-400">
          <Clock className="w-4 h-4" />
          最后编辑：{notesPage.dateEnd}
        </div>
      </div>
    </div>
  );
}

