'use client';

import React, { useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Note, NotesPage } from '@/types/note/type';
import { filterNotes } from '@/lib/notes/filterNotes';
import { NoteTreeToolbar } from './NoteTreeToolbar';
import { NoteTreeFolder } from './NoteTreeFolder';
import { NoteTreeEmpty } from './NoteTreeEmpty';

interface NoteTreeViewProps {
  notes: Note[];
  formatDate: (d: string) => string;
  onCreateCategory: () => void;
  onRenameCategory: (id: number, title: string) => void;
  onDeleteCategory: (id: number) => void;
  onDeletePage: (pageId: string) => void;
  onMovePage: (pageId: string, fromNoteId: number, toNoteId: number) => void;
}

interface DragState {
  pageId: string;
  sourceNoteId: number;
}

export function NoteTreeView({
  notes,
  formatDate,
  onCreateCategory,
  onRenameCategory,
  onDeleteCategory,
  onDeletePage,
  onMovePage,
}: NoteTreeViewProps) {
  const treeRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [dragData, setDragData] = useState<DragState | null>(null);
  const [dropTargetNoteId, setDropTargetNoteId] = useState<number | null>(null);

  const searchMode = searchQuery.trim().length > 0;

  // 搜索过滤：命中分类整保留；只命中页面则只留该页
  const filteredNotes = useMemo(
    () => filterNotes(notes, searchQuery),
    [notes, searchQuery]
  );

  // 节点入场 stagger
  useGSAP(
    () => {
      gsap.fromTo(
        '.tree-row',
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: true,
          clearProps: 'opacity,transform',
        }
      );
    },
    { dependencies: [filteredNotes.length, searchQuery], scope: treeRef }
  );

  const isExpanded = (id: number) => (searchMode ? true : expandedIds.has(id));

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(notes.map((n) => n.id)));
  const collapseAll = () => setExpandedIds(new Set());

  const handlePageDragStart = (e: React.DragEvent, page: NotesPage, noteId: number) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ pageId: page.pageId, sourceNoteId: noteId }));
    e.dataTransfer.effectAllowed = 'move';
    setDragData({ pageId: page.pageId || '', sourceNoteId: noteId });
  };

  const handleDragEnd = () => {
    setDragData(null);
    setDropTargetNoteId(null);
  };

  const handleFolderDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== dragData?.sourceNoteId) {
      setDropTargetNoteId(id);
    }
  };

  const handleFolderDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropTargetNoteId(null);
    }
  };

  const handleFolderDrop = (e: React.DragEvent, toNoteId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTargetNoteId(null);

    let data: DragState | null = dragData;
    if (!data) {
      try {
        const raw = e.dataTransfer.getData('application/json');
        if (raw) data = JSON.parse(raw) as DragState;
      } catch {
        data = null;
      }
    }
    if (!data?.pageId || data.sourceNoteId === toNoteId) return;

    // 目标分类展开 + 移动
    setExpandedIds((prev) => new Set(prev).add(toNoteId));
    onMovePage(data.pageId, data.sourceNoteId, toNoteId);
    setDragData(null);
  };

  const totalPages = notes.reduce((sum, n) => sum + (n.page?.length || 0), 0);

  return (
    <div ref={treeRef}>
      <NoteTreeToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateCategory={onCreateCategory}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
        totalCategories={notes.length}
        totalPages={totalPages}
      />

      {filteredNotes.length === 0 ? (
        <NoteTreeEmpty hasAnyNotes={notes.length > 0} onResetSearch={() => setSearchQuery('')} />
      ) : (
        <div className="max-h-[65vh] min-h-[240px] rounded-lg border border-border/40 bg-card/50 p-2 custom-scrollbar overflow-y-auto">
          {filteredNotes.map((note) => (
            <NoteTreeFolder
              key={note.id}
              note={note}
              allNotes={notes}
              formatDate={formatDate}
              isExpanded={isExpanded(note.id)}
              onToggle={toggleExpand}
              isDropTarget={dropTargetNoteId === note.id}
              onDragOver={handleFolderDragOver}
              onDragLeave={handleFolderDragLeave}
              onDrop={handleFolderDrop}
              onRenameCategory={onRenameCategory}
              onDeleteCategory={onDeleteCategory}
              onDeletePage={onDeletePage}
              onMovePage={onMovePage}
              onPageDragStart={handlePageDragStart}
              onPageDragEnd={handleDragEnd}
            />
          ))}
        </div>
      )}
    </div>
  );
}
