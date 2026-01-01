'use client'
import NextRouter from '@/components/layout/NextRouter';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useNotes } from '@/hooks/note/useNotes';
import { Note, NotesPage } from '@/types/note/type';
import { NotePageHeader } from '@/components/features/notes/notePageHeader';
import { NotePageMeta } from '@/components/features/notes/notePageMeta';
import { NotePageContent } from '@/components/features/notes/notePageContent';
import { NotePageTags } from '@/components/features/notes/notePageTags';
import { NotePageLoading } from '@/components/features/notes/notePageLoading';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/shadcnComponents/button';
import { ArrowUpIcon } from 'lucide-react';
const NotePage = () => {
  const { notesID, notePageID } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [notesPage, setNotesPage] = useState<NotesPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageBackground, setIsImageBackground] = useState(false);
  const { theme } = useTheme();



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
    <div
      className="min-h-screen"
      style={{
        backgroundImage: isImageBackground
          ? theme === 'dark'
            ? 'url(/NotesImage/page/notepage_dark.jpeg)'
            : 'url(/NotesImage/page/notepage_light.jpeg)'
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="font-sans transition-colors duration-300 bg-sky-50/90 dark:bg-slate-700/80"
      >

        <NextRouter showHeader={false}>
          <NotePageHeader setIsImageBackground={setIsImageBackground} />
          <main
            className="min-h-screen container mx-auto px-4 sm:px-6 py-8 max-w-3xl"
            key={notesPage.uid}
          >
            <NotePageMeta notesPage={notesPage} />
            <NotePageContent content={notesPage.content} theme={theme as 'light' | 'dark'} />
            <NotePageTags tags={notesPage.pageTags} />
          </main>

        </NextRouter>
              <footer
        className="fixed bottom-[3%] left-[3%] "
      >
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          variant="outline"
          aria-label="Submit"
          className="bg-card/60"

        >
          <span className="hidden md:inline-block">返回上级</span>

          <ArrowUpIcon />
        </Button>
      </footer>
      </div>
    </div>
  );
};

export default NotePage;
