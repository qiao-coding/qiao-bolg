'use client'
// 笔记页面组件 - 展示笔记内容详情和元信息
import NextRouter from '@/components/layout/NextRouter';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api_notes } from '@/hooks/note/api_notes';
import { Note, NotesPage } from '@/types/note/type';
import { NotePageHeader } from '@/components/features/notes/page/notePageHeader';
import { NotePageContent } from '@/components/features/notes/notePageContent';
import { NotePageLoading } from '@/components/features/notes/notePageLoading';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { ArrowUpIcon, Calendar, Clock } from 'lucide-react';

export default function NotePageDetail() {
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
        const res = await api_notes.getNoteListById(notesID as string)

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
    <article
      className="min-h-screen"
      style={{
        backgroundImage: isImageBackground
          ? theme === 'dark'
            ? 'url(/note_img/page/notepage_dark.jpeg)'
            : 'url(/note_img/page/notepage_light.jpeg)'
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',

      }}
    >
      <div className="font-sans transition-colors duration-300
       bg-sky-50/90 dark:bg-slate-800/90"
      >

        {/* 路由组件 */}
        <NextRouter showHeader={false}>
          {/* 笔记页面头部 */}
          <NotePageHeader setIsImageBackground={setIsImageBackground} />

          {/* 笔记页面主体 */}
          <main
            className="min-h-screen container mx-auto px-4 sm:px-6 py-8 max-w-3xl"
            key={notesPage.uid}
          >
            {/* 笔记页面标题 */}
            <header className="mb-8 text-card-foreground">
              <h1 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight animate-fade-in">
                {notesPage.title}
              </h1>

              {/* 笔记页面时间信息 */}
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm list-none">
                <li className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <time dateTime={notesPage.dateStart}>发布于{notesPage.dateStart}</time>
                </li>
                <li className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  <time dateTime={notesPage.dateEnd}>最后编辑：{notesPage.dateEnd}</time>
                </li>
              </ul>
            </header>

            {/* 笔记页面内容 */}
            <NotePageContent content={notesPage.content} theme={theme as 'light' | 'dark'} />
            
            {/* 笔记页面标签 */}
            <section aria-labelledby="note-tags" className="mt-8 pt-6 border-t transition-all duration-300 border-border">
              <div className="flex flex-wrap items-center gap-3">
                <span id="note-tags" className="text-sm text-muted-foreground">标签：</span>
                {note.tags && note.tags.map((tag, index) => (
                  <span
                    key={`tag-${tag}-${index}`}
                    className="inline-flex items-center text-sm px-3 py-1.5
                             rounded-full transition-all duration-300
                             bg-card text-card-foreground border-[1.5px] border-border
                             hover:bg-card/80 hover:shadow-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </main>

        </NextRouter>

        {/* 返回顶部按钮 */}
        <footer
          className="fixed bottom-[3%] left-[3%] "
        >
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            variant="outline"
            aria-label="返回顶部"
            className="bg-card/60 text-black dark:text-white"

          >
            {/* 返回顶部按钮文本 */}
            <span className="hidden md:inline-block">返回顶部</span>

            {/* 返回顶部按钮图标 */}
            <ArrowUpIcon />
          </Button>
        </footer>
      </div>
    </article>
  );
}