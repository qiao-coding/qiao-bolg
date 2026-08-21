// 管理员笔记页面组件 - 目录树管理笔记分类和内容
'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { Card, CardContent } from '@/components/ui/shadcnComponents/data-display/card';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useLocale, useT } from '@/i18n/LocaleContext';
import { useSession } from 'next-auth/react';
import type { CreateNoteInput, Note, NotesPage } from '@/types/note/type';
import { NoteHeaderCard } from '@/components/features/admin/notes/headerCard';
import { NoteTreeView } from '@/components/features/admin/notes/treeView/NoteTreeView';
import {
  CardHeader,
  CardTitle
} from '@/components/ui/shadcnComponents/data-display/card';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcnComponents/overlay/dialog';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { Input } from '@/components/ui/shadcnComponents/forms/input';
import { Label } from '@/components/ui/shadcnComponents/forms/label';
import { api_notes } from '@/hooks/note/api_notes';


export default function StudyNotes() {
  const t = useT();
  const { data: session } = useSession();
  // 笔记列表状态
  const [notes, setNotes] = useState<Note[]>([]);
  // 新建笔记分类的标题输入
  const [addNotesPage, setAddNotesPage] = useState('');

  // 新增笔记弹窗开关
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

  // 计算所有标签（去重）
  const allTags = Array.from(new Set(
    notes.flatMap(note => [...(note.tags || []), ...(note.page || []).flatMap(page => page.pageTags || [])])
  ));

  // 获取所有笔记分类(GET)
  const getNotes = async () => {
    try {
      const response = await api_notes.getNote({
        credentials: 'include'
      });
      // 格式化后端返回的笔记数据
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


  // 组件挂载时拉取笔记数据
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getNotes();
  }, []);

  // 日期格式化工具函数
  const locale = useLocale();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: locale === 'zh' ? zhCN : enUS });
    } catch {
      return dateString;
    }
  };

  // 提交新建笔记分类
  const submitAddNote = async (e: FormEvent) => {
    e.preventDefault();
    setIsAddDialogOpen(false);

    // 构造新笔记对象
    const newNotes: CreateNoteInput = {
      title: addNotesPage,
      tags: [addNotesPage],
      titlePicture: '',
    };

    try {
      const response = await api_notes.postNote(newNotes);
      if (response) {
        // 成功后更新本地列表
        setNotes(prev => [...prev, response]);
        setAddNotesPage('');
      }
    } catch (error) {
      console.error('新建笔记分类失败:', error);
    }
  };

  // 重命名笔记分类
  const handleUpdateNote = async (id: number, title: string) => {
    const current = notes.find(note => note.id === id);
    try {
      const response = await api_notes.putNote({
        id,
        title,
        tags: current?.tags || [],
        createdAt: current?.createdAt || '',
        updatedAt: new Date().toISOString(),
        titlePicture: current?.titlePicture || '',
      });
      if (response) {
        setNotes(prev => prev.map(note => note.id === id ? { ...note, title } : note));
      }
    } catch (error) {
      console.error('更新笔记分类失败:', error);
    }
  };

  // 新建笔记页面（POST）
  const handleCreatePage = async (noteId: number, title: string) => {
    const newNotesPage: NotesPage = {
      id: new Date().getTime(),
      uid: crypto.randomUUID(),
      title,
      content: '',
      author: session?.user?.name || '',
      dateStart: new Date().toLocaleString('sv-SE'),
      dateEnd: new Date().toLocaleString('sv-SE'),
      pageTags: [],
      noteId,
      pageId: crypto.randomUUID(),
    };

    try {
      await api_notes.postNotePage(newNotesPage);
      await getNotes();
    } catch (error) {
      console.error('新建笔记失败:', error);
    }
  };

  // 删除笔记分类（连带删除其下页面）
  const handleDeleteNote = async (id: number) => {
    try {
      const response = await api_notes.deleteNote(id);
      if (response) {
        setNotes(prev => prev.filter(note => note.id !== id));
      }
    } catch (error) {
      console.error('删除笔记分类失败:', error);
    }
  };

  // 删除笔记页面
  const handleDeletePage = async (pageId: string) => {
    try {
      await api_notes.deleteNotePage(pageId);
      setNotes(prev => prev.map(note => ({
        ...note,
        page: (note.page || []).filter(p => p.pageId !== pageId),
      })));
    } catch (error) {
      console.error('删除笔记失败:', error);
    }
  };

  // 移动笔记页面到其他分类（乐观更新 + 失败回滚）
  const handleMovePage = async (pageId: string, fromNoteId: number, toNoteId: number) => {
    const from = notes.find(n => n.id === fromNoteId);
    const page = from?.page?.find(p => p.pageId === pageId);
    if (!page || fromNoteId === toNoteId) return;

    // 乐观更新
    setNotes(prev => prev.map(n => {
      if (n.id === fromNoteId) return { ...n, page: (n.page || []).filter(p => p.pageId !== pageId) };
      if (n.id === toNoteId) return { ...n, page: [...(n.page || []), page] };
      return n;
    }));

    try {
      await api_notes.putNotePage({ ...page, noteId: toNoteId });
    } catch (error) {
      console.error('移动笔记失败:', error);
      await getNotes(); // 回滚重拉
    }
  };


  return (
    <main className="text-foreground">
      {/* 顶部统计卡片 */}
      <section className="mb-6">
        <NoteHeaderCard
          notes={notes}
          allTags={allTags}
        />
      </section>

      {/* 目录树主区域 */}
      <section className="space-y-6">
        <Card className="
        relative overflow-hidden rounded-[28px] border border-white/70 bg-card/72 shadow-[0_24px_70px_rgba(255,132,189,0.14)] backdrop-blur-md dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/74 dark:shadow-[0_24px_70px_rgba(10,18,34,0.28)] hover:shadow-2xl">
          <CardHeader className="px-6 pt-6 pb-4">
            <header>
              <CardTitle className="text-xl font-bold text-brand-grad">
                {t('admin.notesCategory')}
              </CardTitle>
            </header>
          </CardHeader>

          <CardContent className="p-6 pt-0 border-0 shadow-none bg-transparent">
            <NoteTreeView
              notes={notes}
              formatDate={formatDate}
              onCreateCategory={() => setIsAddDialogOpen(true)}
              onRenameCategory={handleUpdateNote}
              onDeleteCategory={handleDeleteNote}
              onCreatePage={handleCreatePage}
              onDeletePage={handleDeletePage}
              onMovePage={handleMovePage}
            />
          </CardContent>
        </Card>
      </section>

      {/* 新建分类弹窗 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px] backdrop-blur-md bg-card/95 border border-white/60 rounded-[28px] shadow-[0_24px_70px_rgba(255,132,189,0.14)] dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/95">
          <form onSubmit={submitAddNote}>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">{t('admin.newCategoryTitle')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1" className="font-medium">{t('admin.title')}</Label>
                <Input
                  id="name-1"
                  name="name"
                  onChange={(e) => setAddNotesPage(e.target.value)}
                  className="border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="rounded-full bg-brand-grad text-white shadow-[0_10px_22px_rgba(255,143,199,0.28)] transition-transform hover:-translate-y-0.5"
              >
                {t('admin.add')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
