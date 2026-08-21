'use client';

import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import Title from '@/components/ui/public/title';

interface NoteListHeaderProps {
  title: string;
}

export function NoteListHeader({ title }: NoteListHeaderProps) {
  return (
    <header>
      <Link href='/admin/notes' className='flex items-center gap-2 mb-6 px-4 py-2.5 rounded-full border border-brand-blue/25 bg-white/78 text-brand-blue-deep shadow-sm hover:-translate-y-0.5 transition-transform duration-300 w-fit group dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]'>
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-sm font-medium">返回分类列表</span>
      </Link>
      <Title className="text-brand-grad">{title}笔记</Title>
    </header>
  );
}