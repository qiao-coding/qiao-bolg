'use client'
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/shadcnComponents/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcnComponents/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/shadcnComponents/alert';
import {  ArrowLeft, FileText } from 'lucide-react';
import { useNotes } from '@/hooks/note/useNotes';
import { NotesPage } from '@/types/note/type';
import { useSession } from 'next-auth/react';
import { NoteListPageContentCard } from '@/components/features/admin/notes/noteList/noteListPage/ContentCard';
import LoadingPage from '@/components/ui/shadcnComponents/loadingPage';


const NoteEditPage = () => {
  const { pageId } = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [notePage, setNotePage] = useState<NotesPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [upNoteNotePage, setUpdateNotePage] = useState<NotesPage | null>(null);
  const {data:session}=useSession()



  useEffect(() => {
    const fetchNotePage = async () => {

      try {
        setLoading(true);
        const notesResponse = await useNotes.getNote()
        let foundPage: NotesPage | null = null;

        for (const note of notesResponse) {
          const page = note.page.find((p: NotesPage) => p.id.toString() === pageId);
          if (page) {
            foundPage = page;
            break;
          }
        }
        if (!foundPage) throw new Error('Page not found');
        setNotePage(foundPage);
        setUpdateNotePage(foundPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取笔记页面失败');
      } finally {
        setLoading(false);
      }
    };

    fetchNotePage();
  }, [pageId]);


  // 保存笔记 
  const handleSave = async () => {
    if (!upNoteNotePage || !notePage || !notePage.uid) {
      setError('缺少必要的参数');
      return;
    }

    const newNotePage: NotesPage = {
      id: notePage.id,
      uid: notePage.uid,
      author: session?.user?.name || '',
      pageId: notePage?.id * 10000 + notePage.uid + 1,
      title: upNoteNotePage.title,
      content: upNoteNotePage.content,
      pageTags: upNoteNotePage.pageTags,
      dateStart: notePage.dateStart,
      dateEnd: new Date().toLocaleString('sv-SE'),
      noteId: notePage.noteId,
    };

    try {
      setIsSaving(true);


      // 更新现有笔记页面
      if (!notePage) return;
      const res = await useNotes.putNotePage(newNotePage);

      
      if (!res) {
        return
      }


      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        router.back();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存笔记失败');
    } finally {
      setIsSaving(false);
    }
  };


  // 取消编辑
  const handleCancel = () => {
    router.back();
  };

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
        <Card className="w-full py-0 max-w-4xl shadow-lg border border-border/20 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <CardHeader className="bg-gradient-to-r py-6 from-primary/10 to-primary/5 border-b border-border/10">
            <CardTitle className="flex items-center gap-2 text-primary">
              <FileText className="h-5 w-5" />
              加载笔记内容...
            </CardTitle>
          </CardHeader>
          <CardContent className="py-8 flex flex-col items-center justify-center">
            <p className="text-muted-foreground animate-pulse text-lg">正在准备笔记...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl px-6 py-8">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            onClick={handleCancel}
            className="w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 transition-colors duration-300 max-w-6xl mx-auto">
        {/* 页面标题栏 */}
        <header className="flex items-center  mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="rounded-full hover:bg-background/80 hover:text-primary
              ml-12"
            >
              <ArrowLeft className="h-5 w-5" />
              <h1 className="text-2xl font-bold text-primary">编辑笔记</h1>
            </Button>
          </div>

        </header>

        {/* 主内容卡片 */}
        <NoteListPageContentCard
          notePage={notePage  as NotesPage}
          upNoteNotePage={upNoteNotePage as NotesPage}
          setUpdateNotePage={setUpdateNotePage}
          handleCancel={handleCancel}
          isSaving={isSaving}
          handleSave={handleSave}
        />

        {/* 保存成功提示 */}
        {showSuccessToast && (
          <div className={`
            fixed bottom-6 right-6 max-w-xs p-4 rounded-lg shadow-lg z-50
            ${theme === 'light' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-green-900/80 text-green-100 border border-green-800'}
            backdrop-blur-sm animate-slide-up
            transition-all duration-300
          `}>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-medium">笔记保存成功！</p>
            </div>
          </div>
        )}
    </div>
  );
};

export default NoteEditPage;