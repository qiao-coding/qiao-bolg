'use client'
import { Card, CardContent, CardFooter } from '@/components/ui/shadcnComponents/card';
import { Button } from '@/components/ui/shadcnComponents/button';
import { Eye, FileText, CalendarPlus, LucideCalendarCheck2, MoreVertical, Trash2, Edit } from 'lucide-react';
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Card className="py-0 flex dark:border dark:border-white flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <NoteCategoryCardHeader note={note} />

        <CardContent className="flex-1 p-4 pb-0">
          <div className="flex items-center pb-2 text-xs text-muted-foreground gap-2">
            <CalendarPlus className="h-4 w-4" />
            <span>{note.createdAt && formatDate(note.createdAt)}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            <LucideCalendarCheck2 className="h-4 w-4" />
            <span>{note.updatedAt && formatDate(note.updatedAt)}</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <Link href={`/admin/notes/${note.id}`}>
            <Button size="sm" variant="ghost" className="gap-1">
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

