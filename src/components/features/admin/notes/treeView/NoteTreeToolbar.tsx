'use client';

import { Plus, Search, ChevronsUpDown, ChevronsDownUp, FolderTree } from 'lucide-react';
import { Input } from '@/components/ui/shadcnComponents/forms/input';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { useT } from '@/i18n/LocaleContext';

interface NoteTreeToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateCategory: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  totalCategories: number;
  totalPages: number;
}

export function NoteTreeToolbar({
  searchQuery,
  onSearchChange,
  onCreateCategory,
  onExpandAll,
  onCollapseAll,
  totalCategories,
  totalPages,
}: NoteTreeToolbarProps) {
  const t = useT();

  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FolderTree className="h-4 w-4 text-sky-500 dark:text-sky-300" />
          <span>{totalCategories} {t('admin.notesCategory')}</span>
          <span className="text-muted-foreground/50">·</span>
          <span>{t('admin.notesTree.pageCount', { count: totalPages })}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={onExpandAll} className="gap-1 cursor-pointer text-muted-foreground">
            <ChevronsDownUp className="h-4 w-4" />
            {t('admin.notesTree.expandAll')}
          </Button>
          <Button size="sm" variant="ghost" onClick={onCollapseAll} className="gap-1 cursor-pointer text-muted-foreground">
            <ChevronsUpDown className="h-4 w-4" />
            {t('admin.notesTree.collapseAll')}
          </Button>
          <Button
            size="sm"
            onClick={onCreateCategory}
            className="gap-1 cursor-pointer text-white bg-gradient-to-r from-sky-400 to-pink-400 hover:from-sky-500 hover:to-pink-500 transition-all duration-300 shadow-lg shadow-sky-200/60 hover:shadow-xl"
          >
            <Plus className="h-4 w-4" />
            {t('admin.newCategory')}
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('admin.searchPlaceholder')}
          className="pl-10 border-border/40 focus:border-primary/50 transition-colors"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
