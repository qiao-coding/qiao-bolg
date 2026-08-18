'use client';

import React, { useRef, useState } from 'react';
import { FileText, MoreVertical, Edit3, FolderInput, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcnComponents/forms/select';
import { useRouter } from '@/i18n/navigation';
import { useT } from '@/i18n/LocaleContext';
import { NotesPage } from '@/types/note/type';
import { MenuItem } from '@/types/components/ui/public/GenericDropdownMenu.type';
import { GenericDropdownMenu } from '@/components/ui/public/GenericDropdownMenu';

interface NoteTreePageProps {
  page: NotesPage;
  noteId: number;
  /** 用于"移动到..." fallback 的目标分类（不含当前分类） */
  moveTargets: { id: number; title: string }[];
  formatDate: (d: string) => string;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, page: NotesPage, noteId: number) => void;
  onDragEnd: () => void;
  onDeletePage: (pageId: string) => void;
  onMovePage: (pageId: string, fromNoteId: number, toNoteId: number) => void;
}

export function NoteTreePage({
  page,
  noteId,
  moveTargets,
  formatDate,
  onDragStart,
  onDragEnd,
  onDeletePage,
  onMovePage,
}: NoteTreePageProps) {
  const t = useT();
  const router = useRouter();
  const justDragged = useRef(false);
  const [moveTargetId, setMoveTargetId] = useState<string>(moveTargets[0]?.id?.toString() ?? '');

  const editUrl = `/admin/notes/${noteId}/edit/${page.pageId}`;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    justDragged.current = true;
    onDragStart(e, page, noteId);
  };

  const handleClick = () => {
    if (justDragged.current) {
      justDragged.current = false;
      return;
    }
    if (page.pageId) {
      router.push(editUrl);
    }
  };

  const menuItems: MenuItem[] = [
    {
      label: t('admin.edit'),
      icon: <Edit3 className="h-4 w-4" />,
      action: () => {
        if (page.pageId) router.push(editUrl);
      },
    },
    ...(moveTargets.length > 0
      ? [
          {
            label: t('admin.notesTree.movePage'),
            icon: <FolderInput className="h-4 w-4" />,
            dialog: {
              title: t('admin.notesTree.movePage'),
              content: (
                <div className="flex items-center gap-2">
                  <Select value={moveTargetId} onValueChange={setMoveTargetId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('admin.title')} />
                    </SelectTrigger>
                    <SelectContent>
                      {moveTargets.map((target) => (
                        <SelectItem key={target.id} value={target.id.toString()}>
                          {target.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ),
              confirmText: t('admin.save'),
              onConfirm: () => {
                const target = Number(moveTargetId);
                if (page.pageId && target && target !== noteId) {
                  onMovePage(page.pageId, noteId, target);
                }
              },
            },
          } satisfies MenuItem,
        ]
      : []),
    {
      label: t('admin.delete'),
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
      dialog: {
        title: t('admin.confirmDelete'),
        content: t('admin.notesTree.deletePageConfirm', { title: page.title }),
        confirmText: t('admin.delete'),
        onConfirm: () => {
          if (page.pageId) onDeletePage(page.pageId);
        },
      },
    },
  ];

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      className="tree-row group flex cursor-pointer items-center gap-2 rounded-md py-1.5 pl-3 pr-1 text-sm text-foreground hover:bg-accent/60 transition-colors duration-200"
    >
      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="flex-1 truncate">{page.title}</span>
      <span className="hidden shrink-0 text-xs text-muted-foreground/70 group-hover:inline">
        {page.dateEnd ? formatDate(page.dateEnd) : ''}
      </span>
      <GenericDropdownMenu
        items={menuItems}
        customTrigger={
          <Button
            size="icon"
            variant="ghost"
            draggable={false}
            onClick={(e) => e.stopPropagation()}
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        }
      />
    </div>
  );
}
