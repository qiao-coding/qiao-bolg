'use client';

import { Search } from 'lucide-react';
import {
  Input
} from '@/components/ui/shadcnComponents/input';


interface NoteListSearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function NoteListSearchFilter({
  searchTerm,
  setSearchTerm,

}: NoteListSearchFilterProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 p-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="搜索笔记标题或标签..."
          className="pl-10 border-border/40 focus:border-primary/50 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}