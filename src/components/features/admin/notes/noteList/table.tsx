'use client';

import React from 'react';
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  Tag,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/shadcnComponents/table';
import {
  Badge
} from '@/components/ui/shadcnComponents/badge';
import {
  Button
} from '@/components/ui/shadcnComponents/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/shadcnComponents/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/shadcnComponents/dialog';
import Link from 'next/link';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { NotesPage } from '@/types/note/type';

interface NoteListTableProps {
  pages: NotesPage[];
  selectedNotes: number[];
  sortField: 'title' | 'dateStart' | 'dateEnd' | null;
  sortDirection: 'asc' | 'desc';
  onToggleSelectAll: () => void;
  onToggleSelectItem: (id: number) => void;
  onSortChange: (field: 'title' | 'dateStart' | 'dateEnd') => void;
  onDeletePage: (pageId: string) => void;
  noteId?: number;
}

export function NoteListTable({
  pages,
  selectedNotes,
  sortField,
  sortDirection,
  onToggleSelectAll,
  onToggleSelectItem,
  onSortChange,
  onDeletePage,
  noteId,
}: NoteListTableProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: zhCN });
    } catch {
      return dateString;
    }
  };

  const renderSortIcon = (field: 'title' | 'dateStart' | 'dateEnd') => {
    if (sortField !== field) {
      return <ChevronDown className="h-4 w-4 opacity-30" />;
    }
    return sortDirection === 'asc' ?
      <ChevronUp className="h-4 w-4" /> :
      <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="rounded-lg 
    border border-border/40 shadow-sm 
    bg-card/50
    ">
      <Table>
        <TableHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <TableRow className="hover:bg-primary/5 transition-colors duration-200">
            <TableHead className="w-[40px] border-r border-border/30">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border/60 text-primary focus:ring-primary/50 focus:border-primary/50 transition-colors"
                checked={selectedNotes.length > 0 && selectedNotes.length === pages.length}
                onChange={onToggleSelectAll}
              />
            </TableHead>
            <TableHead
              className="cursor-pointer border-r border-border/30 hover:bg-primary/10 transition-colors duration-200"
              onClick={() => onSortChange('title')}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary/80" />
                <span className="font-medium">标题</span>
                {renderSortIcon('title')}
              </div>
            </TableHead>
            <TableHead className="border-r border-border/30">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary/80" />
                <span className="font-medium">标签</span>
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer border-r border-border/30 hover:bg-primary/10 transition-colors duration-200"
              onClick={() => onSortChange('dateStart')}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary/80" />
                <span className="font-medium">创建时间</span>
                {renderSortIcon('dateStart')}
              </div>
            </TableHead>
            <TableHead className="text-right font-medium">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground/70 bg-gradient-to-br from-card/60 to-card/40">
                没有找到匹配的笔记
              </TableCell>
            </TableRow>
          ) : (
            pages.map((page) => (
              <TableRow key={page.id} className="hover:bg-primary/5 transition-colors duration-200 border-b border-border/20">
                <TableCell className="border-r border-border/30">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border/60 text-primary focus:ring-primary/50 focus:border-primary/50 transition-colors"
                    checked={selectedNotes.includes(page.id)}
                    onChange={() => onToggleSelectItem(page.id)}
                  />
                </TableCell>
                <TableCell className="font-medium border-r border-border/30">{page.title}</TableCell>
                <TableCell className="border-r border-border/30">
                  <div className="flex flex-wrap gap-1">
                    {page.pageTags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="bg-gradient-to-r from-primary/10 to-primary/5 text-primary/90 border border-primary/20 hover:from-primary/15 hover:to-primary/10 transition-colors duration-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground/80 border-r border-border/30">{formatDate(page.dateStart || '')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors duration-200">
                        <span className="sr-only">打开菜单</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="backdrop-blur-sm bg-card/90 dark:bg-card/90 border border-border/40 shadow-lg">
                      <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-200">
                        <Edit3 className="h-4 w-4 mr-2 text-primary/80" />
                        <Link href={`/admin/notes/${noteId}/edit/${page.id}`} className="w-full text-left">
                          编辑
                        </Link>
                      </DropdownMenuItem>
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem 
                            onSelect={(e) => e.preventDefault()}
                            className="text-red-500/90 hover:text-red-600 hover:bg-red-50/50 focus:text-red-600 focus:bg-red-50/50 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent className="backdrop-blur-sm bg-card/90 dark:bg-card/90 border border-border/40 shadow-2xl">
                          <DialogHeader>
                            <DialogTitle>确认删除</DialogTitle>
                            <DialogDescription>
                              此操作不可撤销，删除后笔记后将无法恢复。
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button 
                              variant="destructive" 
                              onClick={() => onDeletePage(page?.pageId || '')}
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300"
                            >
                              删除
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}