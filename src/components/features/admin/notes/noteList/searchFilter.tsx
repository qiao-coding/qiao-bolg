'use client';

import { Search } from 'lucide-react';
import {
  Input
} from '@/components/ui/shadcnComponents/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/shadcnComponents/select';

interface NoteListSearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterTags: string;
  setFilterTags: (filter: string) => void;
  notesPageOptions: { id: number; title: string }[];
}

export function NoteListSearchFilter({
  searchTerm,
  setSearchTerm,
  filterTags,
  setFilterTags,
  notesPageOptions,
}: NoteListSearchFilterProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="搜索笔记标题或标签..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex justify-end flex-wrap gap-2">
        <Select value={filterTags} onValueChange={setFilterTags}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="标签筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部标题</SelectItem>
            {notesPageOptions.map(option => (
              <SelectItem key={option.id} value={option.id.toString()}>{option.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}