'use client'
import { Card, CardContent, CardFooter } from '@/components/ui/shadcnComponents/data-display/card';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { Eye, CalendarPlus, LucideCalendarCheck2, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { Note } from '@/types/note/type';

import { NoteCategoryCardHeader } from '../../features/admin/notes/categoryCardHeader';
import { MenuItem } from '@/types/components/ui/public/GenericDropdownMenu.type';
import { GenericDropdownMenu } from '../public/GenericDropdownMenu';

export function NoteCategoryCard({
  note,
  formatDate,
  handleUpdateNote,
  handleDeleteNote,
  setPutNotesPage,
  putNotesPage

}: {
  note: Note
  formatDate: (date: string) => string;
  handleUpdateNote: (id: number) => void
  handleDeleteNote: (id: number) => void
  setPutNotesPage: (notes: Note) => void
  putNotesPage: Note
}) {

  // 定义菜单项
  const menuItems: MenuItem[] = [
    // 编辑项 - 带输入对话框
    {
      label: '编辑',
      icon: <Edit className="h-4 w-4" />,
      inputDialog: {
        title: '编辑笔记',
        label: '标题',
        placeholder: '请输入笔记标题',
        value: putNotesPage?.title || '',
        onChange: (value: string) => setPutNotesPage({ ...putNotesPage, title: value }),
        confirmText: '保存',
        onConfirm: (value: string) => {
          setPutNotesPage({ ...putNotesPage, title: value });
          handleUpdateNote(note.id);
        }
      }
    },
    // 删除项 - 带确认对话框
    {
      label: '删除',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
      dialog: {
        title: '确认删除',
        content: `确定要删除 [ ${note.title} ] 笔记分类吗？此操作不可恢复。`,
        confirmText: '删除',
        onConfirm: () => handleDeleteNote(note.id)
      }
    }
  ];


  return (
    <motion.div
      key={note.id}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative"
    >
      <Card className="py-0 flex cursor-pointer
       flex-col overflow-hidden backdrop-blur-sm
        bg-card/80 dark:bg-card/80 border-2 border-sky-400/40 hover:border-pink-400/40 
        shadow-lg 
         group
        ">
        <NoteCategoryCardHeader note={note} />

        <CardContent className="flex-1 p-4 pb-0">
          <div className="flex items-center pb-2 text-xs text-muted-foreground gap-2">
            <CalendarPlus className="h-3 w-3 text-blue-500" />
            <span className="font-medium">{note.createdAt && formatDate(note.createdAt)}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            <LucideCalendarCheck2 className="h-3 w-3 text-green-500" />
            <span className="font-medium">{note.updatedAt && formatDate(note.updatedAt)}</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <Link href={`/admin/notes/${note.id}`}>
            <Button size="sm" variant="outline" className="gap-1 cursor-pointer border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-colors">
              <Eye className="h-3 w-3" />
              查看
            </Button>
          </Link>

          {/* 下拉菜单 ,编辑和删除*/}
          <GenericDropdownMenu 
            items={menuItems}
            triggerButtonVariant="ghost"
            triggerButtonSize="icon"
          />
        </CardFooter>
      </Card>
    </motion.div>
  );
}