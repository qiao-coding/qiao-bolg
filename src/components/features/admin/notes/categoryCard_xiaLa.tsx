'use client'
import { Card, CardContent, CardFooter } from '@/components/ui/shadcnComponents/card';
import { Badge } from '@/components/ui/shadcnComponents/badge';
import { Button } from '@/components/ui/shadcnComponents/button';
import { Eye, FileText, CalendarPlus, LucideCalendarCheck2, MoreVertical, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Note } from '@/types/note/type';


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/shadcnComponents/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/shadcnComponents/dialog';
import { Input } from '@/components/ui/shadcnComponents/input';

export function NoteCategoryCardXiaLa({
    note,
    handleDeleteNote,
    handleUpdateNote,
    setPutNotesPage,
    isPutLoading,
    setIsPutLoading,
    putNotesPage,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
}: {
    note: Note;
    handleDeleteNote: (id: number) => void;
    handleUpdateNote: (id: number) => void;
    setPutNotesPage: (putNotesPage: { id: number; title: string }) => void;
    isPutLoading: boolean;
    setIsPutLoading: (isPutLoading: boolean) => void;
    putNotesPage: { id: number; title: string }
    isDeleteDialogOpen: boolean;
    setIsDeleteDialogOpen: (isDeleteDialogOpen: boolean) => void;


}
) {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

                {/*  编辑 */}
                <Dialog open={isPutLoading} onOpenChange={setIsPutLoading}>
                    <DialogTrigger asChild>
                        <span
                            onClick={() => setPutNotesPage({ id: note.id, title: note.title })}
                            className='flex items-center gap-2 pt-1 px-2 text-sm'>
                            <Edit className="mr-2 h-4 w-4" />
                            编辑
                        </span>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>编辑笔记</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateNote(note.id);
                        }}>
                            <div className="py-4">
                                <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    标题
                                </label>
                                <Input
                                    id="title"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="请输入笔记标题"
                                    value={putNotesPage?.title || ''}
                                    onChange={(e) => {
                                        setPutNotesPage({ ...putNotesPage, title: e.target.value })
                                    }}
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                >保存</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>


                {/* 删除 */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                        <span
                            className='flex items-center gap-2 pt-1 px-2 text-sm text-destructive'>
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除
                        </span>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>确认删除</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleDeleteNote(note.id);
                        }}>
                            <div className="py-4 text-sm text-muted-foreground">
                                确定要删除 [ {note.title} ] 笔记分类吗？此操作不可恢复。
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="destructive"
                                >
                                    删除
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

            </DropdownMenuContent>
        </DropdownMenu>
    )

}