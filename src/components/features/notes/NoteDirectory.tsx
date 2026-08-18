'use client';

import { useMemo, useRef, useState } from 'react';
import { ChevronRight, FileText, Folder, FolderOpen, ListTree } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { Note } from '@/types/note/type';

interface NoteDirectoryProps {
  notes: Note[];
  activeNoteId: number;
}

/**
 * 笔记详情页左侧只读目录树（类似管理面板 NoteTreeView，仅查阅跳转，无编辑功能）
 * - 分类（folder）点击展开/折叠，默认展开当前分类
 * - 页面（leaf）点击跳转到对应笔记内容页
 * - gsap 入场 stagger + 展开/折叠高度动画
 */
export function NoteDirectory({ notes, activeNoteId }: NoteDirectoryProps) {
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(
    () => new Set([activeNoteId])
  );

  // 分类下页面按 dateEnd 倒序（与管理面板一致）
  const sortedNotes = useMemo(
    () =>
      notes.map((n) => ({
        ...n,
        page: [...(n.page || [])].sort((a, b) => {
          const aDate = new Date(a.dateEnd || '');
          const bDate = new Date(b.dateEnd || '');
          return bDate.getTime() - aDate.getTime();
        }),
      })),
    [notes]
  );

  const toggle = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const goPage = (noteId: number, uid: string) => {
    if (!uid) return;
    router.push(`/notes/${noteId}/${uid}`);
  };

  // 目录行入场 stagger
  useGSAP(
    () => {
      gsap.fromTo(
        '.dir-row',
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.02,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: true,
          clearProps: 'opacity,transform',
        }
      );
    },
    { dependencies: [expandedIds], scope: listRef }
  );

  return (
    <aside className="w-56 rounded-xl border border-sky-200/80 dark:border-sky-500/25 bg-gradient-to-b from-sky-200/70 to-sky-100/60 dark:from-slate-700/90 dark:to-slate-800/80 backdrop-blur-sm shadow-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-3 border-b border-sky-200/60 dark:border-sky-500/15">
        <ListTree className="h-4 w-4 text-sky-500 dark:text-sky-300" />
        <span className="text-sm font-bold text-sky-700 dark:text-sky-200">笔记导航</span>
      </div>

      <div ref={listRef} className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
        <div className="flex flex-col gap-0.5">
          {sortedNotes.map((note) => {
            const expanded = expandedIds.has(note.id);
            const isActiveNote = note.id === activeNoteId;
            return (
              <div key={note.id} className="flex flex-col gap-0.5">
                {/* 分类行 */}
                <button
                  type="button"
                  onClick={() => toggle(note.id)}
                  className={cn(
                    'dir-row flex items-center gap-1.5 w-full rounded-md px-2 py-1.5 text-left transition-colors duration-200 cursor-pointer',
                    isActiveNote
                      ? 'bg-sky-100 text-sky-700 dark:bg-slate-700 dark:text-sky-200'
                      : 'text-foreground hover:bg-sky-100/60 dark:hover:bg-slate-700/50'
                  )}
                >
                  <ChevronRight
                    className={cn(
                      'h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200',
                      expanded && 'rotate-90'
                    )}
                  />
                  {expanded ? (
                    <FolderOpen className="h-4 w-4 shrink-0 text-sky-500 dark:text-sky-300" />
                  ) : (
                    <Folder className="h-4 w-4 shrink-0 text-sky-500 dark:text-sky-300" />
                  )}
                  <span className="flex-1 min-w-0 truncate text-sm font-medium">{note.title}</span>
                  <span className="shrink-0 text-[10px] font-mono text-muted-foreground tabular-nums">
                    {note.page?.length || 0}
                  </span>
                </button>

                {/* 页面行 */}
                {expanded &&
                  (note.page || []).map((p) => (
                    <button
                      key={p.uid || p.id}
                      type="button"
                      onClick={() => goPage(note.id, p.uid || '')}
                      className="dir-row flex items-center gap-2 pl-8 pr-2 py-1.5 rounded-md text-left text-xs text-muted-foreground hover:text-sky-600 hover:bg-sky-100/60 dark:hover:text-sky-200 dark:hover:bg-slate-700/50 transition-colors duration-200 cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                      <span className="flex-1 min-w-0 truncate">{p.title}</span>
                    </button>
                  ))}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
