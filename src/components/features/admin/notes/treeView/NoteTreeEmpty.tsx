'use client';

import { FileText, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { useT } from '@/i18n/LocaleContext';

interface NoteTreeEmptyProps {
  hasAnyNotes: boolean;
  onResetSearch: () => void;
}

export function NoteTreeEmpty({ hasAnyNotes, onResetSearch }: NoteTreeEmptyProps) {
  const t = useT();

  if (!hasAnyNotes) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-card/60 to-card/40 rounded-lg border border-dashed border-border/60 shadow-inner">
        <FileText className="h-16 w-16 text-muted-foreground/40" />
        <p className="mt-4 text-lg font-medium text-muted-foreground">{t('admin.noCategory')}</p>
        <p className="mt-2 text-sm text-muted-foreground/70">{t('admin.clickToCreate')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-card/60 to-card/40 rounded-lg border border-dashed border-border/60 shadow-inner">
      <SearchX className="h-16 w-16 text-muted-foreground/40" />
      <p className="mt-4 text-lg font-medium text-muted-foreground">{t('admin.notesTree.noMatch')}</p>
      <Button size="sm" variant="outline" onClick={onResetSearch} className="mt-4 gap-1 cursor-pointer">
        <SearchX className="h-4 w-4" />
        {t('admin.notesTree.clearSearch')}
      </Button>
    </div>
  );
}
