'use client'
import { Card, CardContent, CardFooter } from '@/components/ui/shadcnComponents/card';
import { Button } from '@/components/ui/shadcnComponents/button';
import { Eye, CalendarPlus, LucideCalendarCheck2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Note } from '@/types/note/type';


import { NoteCategoryCardXiaLa } from './categoryCard_xiaLa';
import { NoteCategoryCardHeader } from './categoryCardHeader';

export function NoteCategoryCard({

  note,
  formatDate,
  handleUpdateNote,
  handleDeleteNote,
  setPutNotesPage,
  putNotesPage,
  isPutLoading,
  setIsPutLoading,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen

}: {
  note: Note
  formatDate: (date: string) => string;
  handleUpdateNote: (id: number) => void
  handleDeleteNote: (id: number) => void
  setPutNotesPage: (notes: Note) => void
  putNotesPage: Note
  isPutLoading: boolean
  setIsPutLoading: (isLoading: boolean) => void
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (isOpen: boolean) => void
}) {


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
          <NoteCategoryCardXiaLa
            note={note}
            handleDeleteNote={handleDeleteNote}
            handleUpdateNote={handleUpdateNote}
            setPutNotesPage={setPutNotesPage}
            putNotesPage={putNotesPage}
            isPutLoading={isPutLoading}
            setIsPutLoading={setIsPutLoading}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          />
        </CardFooter>
      </Card>
    </motion.div>
  );
}

