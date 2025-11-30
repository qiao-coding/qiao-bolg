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
      <Link href='/admin/notes' className='flex items-center gap-1 mb-4'>
        <ArrowLeft className="h-4 w-4" />
        返回分类列表
      </Link>
      <Title>{title}笔记</Title>
    </header>
  );
}