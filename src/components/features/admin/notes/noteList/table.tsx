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
  onDeletePage: (pageId: number) => void;
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={selectedNotes.length > 0 && selectedNotes.length === pages.length}
                onChange={onToggleSelectAll}
              />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => onSortChange('title')}
            >
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>标题</span>
                {renderSortIcon('title')}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span>标签</span>
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => onSortChange('dateStart')}
            >
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>创建时间</span>
                {renderSortIcon('dateStart')}
              </div>
            </TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                没有找到匹配的笔记
              </TableCell>
            </TableRow>
          ) : (
            pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selectedNotes.includes(page.id)}
                    onChange={() => onToggleSelectItem(page.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {page.pageTags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="bg-[#F0F0F0] text-[#333333]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{formatDate(page.dateStart || '')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">打开菜单</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit3 className="h-4 w-4 mr-2" />
                        <Link href={`/admin/notes/${noteId}/edit/${page.id}`} className="w-full text-left">
                          编辑
                        </Link>
                      </DropdownMenuItem>
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem 
                            onSelect={(e) => e.preventDefault()}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>确认删除</DialogTitle>
                            <DialogDescription>
                              此操作不可撤销，删除后笔记后将无法恢复。
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button 
                              variant="destructive" 
                              onClick={() => onDeletePage(page.id)}
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