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
