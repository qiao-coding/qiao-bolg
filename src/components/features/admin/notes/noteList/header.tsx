'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Title from '@/components/ui/public/title';

interface NoteListHeaderProps {
  title: string;
}

export function NoteListHeader({ title }: NoteListHeaderProps) {
  return (
    <header>
      <Link href='/admin/notes' className='flex items-center gap-2 mb-6 px-4 py-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-border/30 hover:from-primary/15 hover:to-primary/10 transition-all duration-300 w-fit group'>
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-sm font-medium">返回分类列表</span>
      </Link>
      <Title className="bg-gradient-to-r from-primary 
      to-primary/80 bg-clip-text text-transparent
      ">{title}笔记</Title>
    </header>
  );
}