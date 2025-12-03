'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/shadcnComponents/card';
import { useSession } from 'next-auth/react';
import { useNotes } from '@/hooks/note/useNotes';
import { Note, NotesPage } from '@/types/note/type';
import { NoteListHeader } from './header';
import { NoteListCardHeader } from './cardHeader';
import { NoteListSearchFilter } from './searchFilter';
import { NoteListTable } from './table';

interface NoteListDetailProps {
  initialNotes: Note | null;
  notesId: string;
}

export function NoteListDetail({ initialNotes, notesId }: NoteListDetailProps) {
  const [notes, setNotes] = React.useState<Note | null>(initialNotes);
  const [notesPage, setNotesPage] = React.useState<NotesPage[]>(initialNotes?.page || []);
  const [addNotesPageTitle, setAddNotesPageTitle] = React.useState<string>('');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [filterTags, setFilterTags] = React.useState<string>('all');
  const [sortField, setSortField] = React.useState<'title' | 'dateStart' | 'dateEnd' | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [selectedNotes, setSelectedNotes] = React.useState<number[]>([]);
  const [isAddNotesDialogOpen, setIsAddNotesDialogOpen] = React.useState<boolean>(false);
  const { data: session } = useSession();
const [pageTags, setPageTags] = React.useState<string[]>([]);

  // 获取notesList(GET)
  React.useEffect(() => {
    const fetchNotes = async () => {
      if (!notesId) return console.error('未提供笔记ID');
      try {
        const response = await useNotes.getNoteList(notesId);
        setNotes(response);
        setNotesPage(response.page || []);
      } catch (error) {
        console.error('获取笔记数据失败:', error);
      }
    };

    if (!initialNotes) {
      fetchNotes();
    }
  }, [notesId, initialNotes]);

  
  const filteredNotesPage = notesPage.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.pageTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = filterTags === 'all' || page.id.toString() === filterTags;
    
    return matchesSearch && matchesTag;
  });

  const sortedPages = [...filteredNotesPage].sort((a, b) => {
    if (!sortField) return 0;

    let valueA: string | number = '';
    let valueB: string | number = '';

    if (sortField === 'title') {
      valueA = a.title.toLowerCase();
      valueB = b.title.toLowerCase();
    } else if (sortField === 'dateStart') {
      valueA = new Date(a.dateStart || '').getTime();
      valueB = new Date(b.dateStart || '').getTime();
    } else if (sortField === 'dateEnd') {
      valueA = new Date(a.dateEnd || '').getTime();
      valueB = new Date(b.dateEnd || '').getTime();
    }

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSelectAll = () => {
    if (selectedNotes.length === sortedPages.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(sortedPages.map(page => page.id));
    }
  };

  const submitAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!notes) return console.error('未提供笔记ID');

    const newNotesPage: NotesPage = {
      id: new Date().getTime(),
      uid: notesPage.length + 1,
      title: addNotesPageTitle,
      content: '',
      author: session?.user?.name || '',
      dateStart: new Date().toLocaleString('sv-SE'),
      dateEnd: new Date().toLocaleString('sv-SE'),
      pageTags: pageTags,
      noteId: Number(notesId),
      pageId: notes.id * 10000 + notesPage.length + 1,
    };

    try {
      await useNotes.postNotePage(newNotesPage);
      setNotesPage(prev => [...prev, newNotesPage]);
      setAddNotesPageTitle('');
      setIsAddNotesDialogOpen(false)
    } catch (error) {
      console.error('新建笔记失败:', error)
    }
  };

  // 删除笔记(DELETE)
  const handleDeleteNotePage = async (pageID: number) => {
    if (!pageID) return console.error('未提供笔记页面ID');

    try {
      await useNotes.deleteNotePage(pageID)
      setNotesPage(prev => prev.filter(page => page.pageId !== pageID))
    } catch (error) {
      console.error('删除笔记失败:', error);
    }
  }


  const handleSortChange = (field: 'title' | 'dateStart' | 'dateEnd') => {
    setSortField(field);
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleToggleSelectItem = (id: number) => {
    if (selectedNotes.includes(id)) {
      setSelectedNotes(selectedNotes.filter(item => item !== id));
    } else {
      setSelectedNotes([...selectedNotes, id]);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 lg:pt-16">
      <NoteListHeader title={notes?.title || ''} />

      <Card>
        <NoteListCardHeader
          title="笔记列表"
          description="管理和编辑所有学习笔记"
          isAddNotesDialogOpen={isAddNotesDialogOpen}
          setIsAddNotesDialogOpen={setIsAddNotesDialogOpen}
          addNotesPageTitle={addNotesPageTitle}
          setAddNotesPageTitle={setAddNotesPageTitle}
          defaultTags={[notes?.title || '']}
          onTagsChange={setPageTags}
          onSubmit={submitAddNote}
        />

        <CardContent>
          <NoteListSearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterTags={filterTags}
            setFilterTags={setFilterTags}
            notesPageOptions={notesPage.map(page => ({ id: page.id, title: page.title }))}
          />

          <NoteListTable
            pages={sortedPages}
            selectedNotes={selectedNotes}
            sortField={sortField}
            sortDirection={sortDirection}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelectItem={handleToggleSelectItem}
            onSortChange={handleSortChange}
            onDeletePage={handleDeleteNotePage}
            noteId={notes?.id}
          />

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              共 {notesPage.length} 条 {notes?.title} 笔记
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};