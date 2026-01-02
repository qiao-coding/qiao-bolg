'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/shadcnComponents/data-display/card';
import { FileText } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useNotes } from '@/hooks/note/useNotes';
import type { CreateNoteInput, Note } from '@/types/note/type';
import { NoteHeaderCard } from '@/components/features/admin/notes/headerCard';
import { NoteCategoryCard } from '@/components/ui/notes/notescategoryCard';
import { Plus } from 'lucide-react';
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
  DialogTrigger
} from '@/components/ui/shadcnComponents/overlay/dialog';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { Input } from '@/components/ui/shadcnComponents/forms/input';
import { Label } from '@/components/ui/shadcnComponents/forms/label';


const StudyNodes = () => {
  // 笔记列表状态
  const [notes, setNotes] = useState<Note[]>([]);
  // 新建笔记分类的标题输入
  const [addNotesPage, setAddNotesPage] = useState('');
  // 删除弹窗开关
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  // 当前正在编辑的笔记对象
  const [putNotesPage, setPutNotesPage] = useState<Note | null>(null);
  // 更新笔记时的加载状态
  const [isPutLoading, setIsPutLoading] = useState<boolean>(false);
  // 新增笔记弹窗开关
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

  // 计算所有标签（去重）
  const allTags = Array.from(new Set(
    notes.flatMap(note => [...(note.tags || []), ...(note.page || []).flatMap(page => page.pageTags || [])])
  ));

  const getNotes = async () => {
    try {
      const response = await useNotes.getNote({
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
  useEffect(() => {
    getNotes();
  }, [notes.length]);

  // 日期格式化工具函数
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: zhCN });
    } catch {
      return dateString;
    }
  };

  // 提交新建笔记分类
  const submitAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddDialogOpen(false);

    // 构造新笔记对象
    const newNotes: CreateNoteInput = {
      title: addNotesPage,
      tags: [addNotesPage],
      titlePicture: '',
    };

    try {
      const response = await useNotes.postNote(newNotes);
      if (response) {
        // 成功后更新本地列表
        setNotes(prev => [...prev, response]);
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
        // 成功后从列表移除
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

    // 构造更新后的笔记对象
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
        // 成功后更新本地列表
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
    <div className="min-h-screen 
    bg-sky-100/60 dark:bg-gray-900/60
    text-foreground">
      <main className="p-6">
        {/* 顶部筛选与统计卡片 */}
        <NoteHeaderCard
          notes={notes}
          allTags={allTags}
        />

        {/* 主区域 */}
        <Card className="
        bg-white/80 dark:bg-card/60 rounded-lg border border-border/40 shadow-xl
        border border-border/40 
        shadow-xl hover:shadow-2xl ">
          {/* 新增笔记分类头部 */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                笔记分类
              </CardTitle>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="gap-1 cursor-pointer bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-4 w-4" />
                  <span>新建分类</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] backdrop-blur-sm bg-card/90 dark:bg-card/90 border border-border/40 shadow-2xl">
                <form onSubmit={submitAddNote}>
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">新建笔记分类</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name-1" className="font-medium">标题</Label>
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
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                    >
                      添加
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>

          {/* 笔记分类列表 */}
          <CardContent className="p-6 border-0 shadow-none 
          bg-transparent
          ">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
             xl:grid-cols-4 gap-6">
              {notes.map((note) => (
                <NoteCategoryCard
                  key={note.id}
                  note={note}
                  formatDate={formatDate}
                  handleUpdateNote={handleUpdateNote}
                  handleDeleteNote={handleDeleteNote}
                  setPutNotesPage={setPutNotesPage}
                  putNotesPage={putNotesPage || note}
                />
              ))}
            </div>

            {/* 空状态提示 */}
            {notes.length === 0 && (
              <div className="text-center py-16 bg-gradient-to-br from-card/60 to-card/40 rounded-lg border border-dashed border-border/60 shadow-inner">
                <FileText className="mx-auto h-16 w-16 text-muted-foreground/40" />
                <p className="mt-4 text-lg text-muted-foreground font-medium">
                  暂无分类，创建第一个笔记分类吧
                </p>
                <p className="text-sm text-muted-foreground/70 mt-2">点击上方按钮开始创建</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudyNodes; 