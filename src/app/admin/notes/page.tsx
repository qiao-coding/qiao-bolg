'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/shadcnComponents/card';
import { CalendarPlus, Edit, Eye, FileText, LucideCalendarCheck2, MoreVertical, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useNotes } from '@/hooks/note/useNotes';
import { Note } from '@/types/note/type';
import { NoteHeaderCard } from '@/components/features/admin/notes/headerCard';
import { NoteCardHeader } from '@/components/features/admin/notes/cardHeader';
import { NoteCategoryCard } from '@/components/features/admin/notes/categoryCard';

const StudyNodes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [addNotesPage, setAddNotesPage] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [putNotesPage, setPutNotesPage] = useState<Note | null>(null);
  const [isPutLoading, setIsPutLoading] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

  const allTags = Array.from(new Set(
    notes.flatMap(note => [...(note.tags || []), ...(note.page || []).flatMap(page => page.pageTags || [])])
  ));

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await useNotes.getNote({
          credentials: 'include'
        });
        const formattedNotes: Note[] = response.map((note: Note) => ({
          id: note.id,
          title: note.title,
          tags: note.tags || [],
          titlePicture: note.titlePicture,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
          page: note.page || []
        }));
        setNotes(formattedNotes);
      } catch (error) {
        console.error('获取笔记数据失败:', error);
      }
    };
    fetchNotes();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: zhCN });
    } catch {
      return dateString;
    }
  };

  const submitAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddDialogOpen(false);

    const newNotes: Note = {
      id: notes.length + 1,
      title: addNotesPage,
      tags: [addNotesPage],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      titlePicture: '',
    };

    try {
      const response = await useNotes.postNote(newNotes);
      if (response) {
        setNotes(prev => [...prev, { ...newNotes }]);
        setAddNotesPage('');
      }
    } catch (error) {
      console.error('新建笔记分类失败:', error);
    }
  };

  // 删除笔记分类
  const handleDeleteNote = async (id: number) => {
    try {
      const response = await useNotes.deleteNote(id);
      if (response) {
        setNotes(prev => prev.filter(note => note.id !== id));
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('删除笔记分类失败:', error);
    }
  };


  // 更新笔记分类
  const handleUpdateNote = async (id: number) => {
    setIsPutLoading(true);

    if (!putNotesPage) {
      setIsPutLoading(false);
      return;
    }

    const newPutNote: Note = {
      id: id,
      title: putNotesPage?.title || '',
      createdAt: notes.find(note => note.id === id)?.createdAt || '',
      updatedAt: new Date().toISOString(),
      titlePicture: '',
    };

    try {
      const response = await useNotes.putNote(newPutNote);
      if (response) {
        setNotes(prev => prev.map(note => note.id === id ? { ...note, title: newPutNote.title } : note));
        setIsPutLoading(false);
        setPutNotesPage(null);
      }
    } catch (error) {
      console.error('更新笔记分类失败:', error);
    } finally {
      setIsPutLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="p-6">
        <NoteHeaderCard
          notes={notes}
          allTags={allTags}
        />

        <Card>
          <NoteCardHeader
            setAddNotesPage={setAddNotesPage}
            isAddDialogOpen={isAddDialogOpen}
            setIsAddDialogOpen={setIsAddDialogOpen}
            submitAddNote={submitAddNote}
          />

          <CardContent className="p-0 border-0 shadow-none bg-transparent px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {notes.map((note) => (
                <NoteCategoryCard
                  key={note.id}
                  note={note}
                  formatDate={formatDate}
                  handleUpdateNote={handleUpdateNote}
                  handleDeleteNote={handleDeleteNote}
                  setPutNotesPage={setPutNotesPage}
                  putNotesPage={putNotesPage || note}
                  isPutLoading={isPutLoading}
                  setIsPutLoading={setIsPutLoading}
                  isDeleteDialogOpen={isDeleteDialogOpen}
                  setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                />
              ))}
            </div>

            {notes.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <p className="mt-4 text-sm text-muted-foreground">
                  暂无分类，创建第一个笔记分类吧
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>




      {/* <NoteDeleteDialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        noteToDelete={noteToDelete}
        handleDeleteNote={handleDeleteNote}
      /> */}
    </div>
  );
};

export default StudyNodes;