'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, Folder, Pencil, Trash2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Collapsible, CollapsibleTrigger } from '@/components/ui/shadcnComponents/navigation/collapsible';
import { Badge } from '@/components/ui/shadcnComponents/data-display/badge';
import { GenericDropdownMenu } from '@/components/ui/public/GenericDropdownMenu';
import { MenuItem } from '@/types/components/ui/public/GenericDropdownMenu.type';
import { useT } from '@/i18n/LocaleContext';
import { Note, NotesPage } from '@/types/note/type';
import { NoteTreePage } from './NoteTreePage';

interface NoteTreeFolderProps {
  note: Note;
  allNotes: Note[];
  formatDate: (d: string) => string;
  isExpanded: boolean;
  onToggle: (id: number) => void;
  isDropTarget: boolean;
  onDragOver: (e: React.DragEvent, id: number) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: number) => void;
  onRenameCategory: (id: number, title: string) => void;
  onDeleteCategory: (id: number) => void;
  onDeletePage: (pageId: string) => void;
  onMovePage: (pageId: string, fromNoteId: number, toNoteId: number) => void;
  onPageDragStart: (e: React.DragEvent, page: NotesPage, noteId: number) => void;
  onPageDragEnd: () => void;
}

export function NoteTreeFolder({
  note,
  allNotes,
  formatDate,
  isExpanded,
  onToggle,
  isDropTarget,
  onDragOver,
  onDragLeave,
  onDrop,
  onRenameCategory,
  onDeleteCategory,
  onDeletePage,
  onMovePage,
  onPageDragStart,
  onPageDragEnd,
}: NoteTreeFolderProps) {
  const t = useT();
  const rowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const prevOpen = useRef<boolean | null>(null);
  const [draftTitle, setDraftTitle] = useState(note.title);

  useEffect(() => {
    setDraftTitle(note.title);
  }, [note.title]);

  // 展开/折叠：高度 + 透明度动画（不用 CollapsibleContent，避免 Radix 卸载子树破坏测量）
  useGSAP(
    () => {
      const content = contentRef.current;
      if (!content) return;

      if (prevOpen.current === null) {
        // 首次挂载：直接同步到目标状态，不做动画
        prevOpen.current = isExpanded;
        gsap.set(content, {
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        });
        return;
      }

      if (prevOpen.current === isExpanded) {
        // 状态未变：若展开且内容可能变化（页面增删），保持 auto 高度响应式
        if (isExpanded) gsap.set(content, { height: 'auto' });
        return;
      }
      prevOpen.current = isExpanded;

      if (isExpanded) {
        gsap.fromTo(
          content,
          { height: 0, opacity: 0 },
          {
            height: content.scrollHeight,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.inOut',
            overwrite: 'auto',
            onComplete: () => gsap.set(content, { height: 'auto' }),
          }
        );
      } else {
        gsap.fromTo(
          content,
          { height: content.scrollHeight, opacity: 1 },
          { height: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut', overwrite: 'auto' }
        );
      }

      if (chevronRef.current) {
        gsap.to(chevronRef.current, {
          rotate: isExpanded ? 90 : 0,
          duration: 0.2,
          ease: 'power2.out',
        });
      }
    },
    { dependencies: [isExpanded, note.page?.length] }
  );

  // drop-target 高亮脉冲
  useGSAP(
    () => {
      if (!rowRef.current) return;
      gsap.to(rowRef.current, {
        scale: isDropTarget ? 1.02 : 1,
        duration: 0.15,
        ease: 'power2.out',
      });
    },
    { dependencies: [isDropTarget] }
  );

  const moveTargets = allNotes
    .filter((n) => n.id !== note.id)
    .map((n) => ({ id: n.id, title: n.title }));

  const folderMenuItems: MenuItem[] = [
    {
      label: t('admin.edit'),
      icon: <Pencil className="h-4 w-4" />,
      inputDialog: {
        title: t('admin.edit'),
        label: t('admin.title'),
        placeholder: t('admin.title'),
        value: draftTitle,
        onChange: setDraftTitle,
        confirmText: t('admin.save'),
        onConfirm: (value: string) => onRenameCategory(note.id, value),
      },
    },
    {
      label: t('admin.delete'),
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
      dialog: {
        title: t('admin.confirmDelete'),
        content: t('admin.notesTree.deleteCategoryWithPages', {
          count: note.page?.length || 0,
        }),
        confirmText: t('admin.delete'),
        onConfirm: () => onDeleteCategory(note.id),
      },
    },
  ];

  return (
    <Collapsible open={isExpanded} onOpenChange={() => onToggle(note.id)}>
      <div
        ref={rowRef}
        onDragOver={(e) => onDragOver(e, note.id)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, note.id)}
        className={`tree-row flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-200 ${
          isDropTarget ? 'bg-primary/10 ring-1 ring-primary/40' : 'hover:bg-accent'
        }`}
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex flex-1 min-w-0 cursor-pointer items-center gap-2 text-left"
          >
            <ChevronRight ref={chevronRef} className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Folder className="h-4 w-4 shrink-0 text-primary/80" />
            <span className="flex-1 truncate text-sm font-medium text-foreground">{note.title}</span>
          </button>
        </CollapsibleTrigger>
        <Badge variant="secondary" className="shrink-0">
          {note.page?.length || 0}
        </Badge>
        <GenericDropdownMenu items={folderMenuItems} triggerButtonSize="icon" />
      </div>

      {/* 页面列表：自定义 div，gsap 控制高度（不用 CollapsibleContent） */}
      <div
        ref={contentRef}
        style={{ height: 0, opacity: 0, overflow: 'hidden' }}
        className="pl-4"
      >
        {(note.page || []).map((p) => (
          <NoteTreePage
            key={p.id}
            page={p}
            noteId={note.id}
            moveTargets={moveTargets}
            formatDate={formatDate}
            onDragStart={onPageDragStart}
            onDragEnd={onPageDragEnd}
            onDeletePage={onDeletePage}
            onMovePage={onMovePage}
          />
        ))}
      </div>
    </Collapsible>
  );
}
