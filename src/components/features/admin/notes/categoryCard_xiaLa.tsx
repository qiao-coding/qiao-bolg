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
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40 rounded-lg border border-border bg-popover p-1 shadow-md">

                {/* 编辑 */}
                <Dialog open={isPutLoading} onOpenChange={setIsPutLoading}>
                    <DialogTrigger asChild>
                        <span
                            onClick={() => setPutNotesPage({ id: note.id, title: note.title })}
                            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                        >
                            <Edit className="h-4 w-4" />
                            编辑
                        </span>
                    </DialogTrigger>
                    <DialogContent className="rounded-lg">
                        <DialogHeader>
                            <DialogTitle>编辑笔记</DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateNote(note.id);
                            }}
                        >
                            <div className="py-4">
                                <label
                                    htmlFor="title"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    标题
                                </label>
                                <Input
                                    id="title"
                                    placeholder="请输入笔记标题"
                                    value={putNotesPage?.title || ''}
                                    onChange={(e) => setPutNotesPage({ ...putNotesPage, title: e.target.value })}
                                    className="mt-2"
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">保存</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* 删除 */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                        <span className="flex cursor-pointer
                         items-center gap-2 rounded px-2 py-1.5 text-sm
                          text-destructive hover:bg-destructive 
                          hover:text-white
                          ">
                            <Trash2 className="h-4 w-4" />
                            删除
                        </span>
                    </DialogTrigger>
                    <DialogContent className="rounded-lg">
                        <DialogHeader>
                            <DialogTitle>确认删除</DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleDeleteNote(note.id);
                            }}
                        >
                            <div className="py-4 text-sm text-muted-foreground">
                                确定要删除 [ {note.title} ] 笔记分类吗？此操作不可恢复。
                            </div>
                            <DialogFooter>
                                <Button variant="destructive" type="submit">
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