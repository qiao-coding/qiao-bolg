'use client'
import NextRouter from '@/components/layout/NextRouter';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useNotes } from '@/hooks/note/useNotes';
import { Note, NotesPage } from '@/types/note/type';
import { NotePageHeader } from '@/components/features/notes/NotePageHeader';
import { NotePageMeta } from '@/components/features/notes/NotePageMeta';
import { NotePageContent } from '@/components/features/notes/NotePageContent';
import { NotePageTags } from '@/components/features/notes/NotePageTags';
import { NotePageLoading } from '@/components/features/notes/NotePageLoading';
const NotePage = () => {
  const { notesID, notePageID } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [notesPage, setNotesPage] = useState<NotesPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);



  // 获取数据(GET)
  useEffect(() => {
    const fetchNotes = async () => {
      if (!notesID) return;

      try {
        setIsLoading(true);
        const res = await useNotes.getNoteListById(notesID as string)

        setNote(res);

        const page = res.page.find((p: NotesPage) => String(p?.uid ?? '').toString() === notePageID);
        if (page) {
          setNotesPage(page);
        }
      } catch (error) {
        console.error('获取笔记详情失败', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, [notesID, notePageID]);


  //等待响应
  if (isLoading || !notesPage || !note) {
    return <NotePageLoading />;
  }


  return (
    <div className="font-sans transition-colors duration-300 bg-[#FAFAFA] dark:bg-gray-900">
      <NextRouter showHeader={false}>
        <NotePageHeader notesID={notesID as string} />
        <main
          className="min-h-screen container mx-auto px-4 sm:px-6 py-8 max-w-3xl"
          key={notesPage.uid}
        >
          <NotePageMeta notesPage={notesPage} />
          <NotePageContent content={notesPage.content} />
          <NotePageTags tags={notesPage.pageTags} />
        </main>
      </NextRouter>
    </div>
  );
};

export default NotePage;
