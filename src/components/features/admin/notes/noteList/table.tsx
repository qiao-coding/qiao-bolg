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
} from '@/components/ui/shadcnComponents/data-display/table';
import {
  Badge
} from '@/components/ui/shadcnComponents/data-display/badge';
import {
  Button
} from '@/components/ui/shadcnComponents/forms/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/shadcnComponents/overlay/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/shadcnComponents/overlay/dialog';
import { Link, useRouter } from '@/i18n/navigation';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useLocale } from '@/i18n/LocaleContext';
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
  
  //格式化日期
  const locale = useLocale();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: locale === 'zh' ? zhCN : enUS });
    } catch {
      return dateString;
    }
  };

  const router = useRouter();


  const renderSortIcon = (field: 'title' | 'dateStart' | 'dateEnd') => {
    if (sortField !== field) {
      return <ChevronDown className="h-4 w-4 opacity-30" />;
    }
    return sortDirection === 'asc' ?
      <ChevronUp className="h-4 w-4" /> :
      <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="rounded-[28px]
    border border-border/40 shadow-sm
    bg-card/50 overflow-hidden
    ">
      <Table>
        <TableHeader className="bg-brand-blue-soft/50 dark:bg-[#26334d]/60">
          <TableRow className="hover:bg-primary/5 transition-colors duration-200">
            <TableHead className="w-[40px] border-r border-border/30">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border/60 accent-brand-pink focus:ring-brand-pink-deep transition-colors"
                checked={selectedNotes.length > 0 && selectedNotes.length === pages.length}
                onChange={onToggleSelectAll}
              />
            </TableHead>
            <TableHead
              className="cursor-pointer border-r border-border/30 hover:bg-primary/10 transition-colors duration-200"
              onClick={() => onSortChange('title')}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-blue-deep dark:text-brand-blue" />
                <span className="font-medium">标题</span>
                {renderSortIcon('title')}
              </div>
            </TableHead>
            <TableHead className="border-r border-border/30">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-brand-blue-deep dark:text-brand-blue" />
                <span className="font-medium">标签</span>
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer border-r border-border/30 hover:bg-primary/10 transition-colors duration-200"
              onClick={() => onSortChange('dateStart')}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand-blue-deep dark:text-brand-blue" />
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
                    className="h-4 w-4
                     rounded border-border/60 accent-brand-pink
                      cursor-pointer focus:ring-brand-pink-deep transition-colors"
                    checked={selectedNotes.includes(page.id)}
                    onChange={() => onToggleSelectItem(page.id)}
                  />
                </TableCell>
                <TableCell 
                onClick={()=>router.push(`/admin/notes/${noteId}/edit/${page.pageId}`)}
                className="font-medium cursor-pointer border-r border-border/30">{page.title}</TableCell>
                <TableCell className="border-r border-border/30">
                  <div className="flex flex-wrap gap-1">
                    {page.pageTags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="bg-brand-pink-soft text-brand-pink-deep border border-brand-pink/30 dark:bg-[#f0b8d4]/15 dark:text-[#ffddec] transition-colors duration-200">
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
                    <DropdownMenuContent align="end" className="backdrop-blur-md bg-card/95 border border-white/60 shadow-lg dark:border-[#8fb7df]/20">
                      <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-200">
                        <Edit3 className="h-4 w-4 mr-2 text-brand-blue-deep dark:text-brand-blue" />
                        <Link href={`/admin/notes/${noteId}/edit/${page.pageId}`} className="w-full text-left">
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
                        <DialogContent className="backdrop-blur-md bg-card/95 border border-white/60 rounded-[28px] shadow-[0_24px_70px_rgba(255,132,189,0.14)] dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/95">
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