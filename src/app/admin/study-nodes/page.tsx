'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Circle,
  Clock
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/shadcnComponents/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/shadcnComponents/dropdown-menu';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/shadcnComponents/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/shadcnComponents/select';
import {
  Input
} from '@/components/ui/shadcnComponents/input';
import {
  Badge
} from '@/components/ui/shadcnComponents/badge';
import {
  Button
} from '@/components/ui/shadcnComponents/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/shadcnComponents/avatar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/shadcnComponents/dialog';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import Link from 'next/link';
import { Label } from '@/components/ui/shadcnComponents/label';

// 根据 Prisma 模型定义的笔记类型
interface Note {
  id: number;
  title: string;
  tags: string[];
  titlePicture?: string;
  createdAt: string;
  updatedAt: string;
  page: NotesPage[];
}

// 根据 Prisma 模型定义的笔记页面类型
interface NotesPage {
  id: number;
  uid: number;
  title: string;
  content: string;
  author: string;
  dateStart: string;
  dateEnd: string;
  pageTags: string[];
  noteId?: number;
  note?: Note;
}

const StudyNodes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [addNotesPage, setAddNotesPage] = useState<Note>({
    id: 0,
    title: '',
    tags: [],
    titlePicture: '',
    createdAt: '',
    updatedAt: '',
    page: [
      {
        id: 0,
        uid: 0,
        title: '',
        content: '',
        author: '',
        dateStart: '',
        dateEnd: '',
        pageTags: [],
        noteId: 0,
        note: undefined
      }
    ]
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterTags, setFilterTags] = useState<string>('all');
  const [sortField, setSortField] = useState<'title' | 'createdAt' | 'updatedAt' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedNotes, setSelectedNotes] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

  // 计算所有笔记页面的扁平化列表
  const allNotePages = notes.flatMap(note =>
    note.page.map(page => ({ ...page, noteTitle: note.title, noteTags: note.tags }))
  );

  // 过滤和搜索笔记页面 
  const filteredAndSearchedPages = allNotePages.filter(page => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.pageTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      page.noteTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.noteTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTag =
      filterTags === 'all' ||
      page.pageTags.includes(filterTags) ||
      page.noteTags.includes(filterTags);

    return matchesSearch && matchesTag;
  });

  // 获取所有可用的标签（包括笔记和页面标签）
  const allTags = Array.from(new Set(
    notes.flatMap(note => [...note.tags, ...note.page.flatMap(page => page.pageTags)])
  ));

  //获取notes数据 - 修复递归调用问题
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes', { method: 'GET', credentials: 'include' });

        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }

        const data = await response.json();
        const formattedNotes: Note[] = data.map((note: Note) => ({
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
        // 如果API调用失败，使用模拟数据

      }
    };

    fetchNotes();

    // 事件监听器和清理函数
    const handleAuthChange = () => fetchNotes();
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // 排序笔记页面
  const sortedPages = [...filteredAndSearchedPages].sort((a, b) => {
    if (!sortField) return 0;

    // 根据不同字段进行排序
    let valueA: string | number = '';
    let valueB: string | number = '';

    if (sortField === 'title') {
      valueA = a.title.toLowerCase();
      valueB = b.title.toLowerCase();
    } else if (sortField === 'createdAt' || sortField === 'updatedAt') {
      // 使用日期字段进行排序
      valueA = new Date(a.dateStart).getTime();
      valueB = new Date(b.dateStart).getTime();
    }

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // 全选/取消全选 - 修复选中逻辑
  const toggleSelectAll = () => {
    if (selectedNotes.length === filteredAndSearchedPages.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(filteredAndSearchedPages.map(page => page.id));
    }
  };

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: zhCN });
    } catch {
      return dateString;
    }
  };

  
  //新建笔记

  const submitAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/notes/post_notes', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addNotesPage)
      })
      if (!response.ok) {
        throw new Error('新建笔记失败');
      }

      const data = await response.json();
      if (data.success) {
        setNotes(prev => [...prev, { ...addNotesPage }]);
      }
    } catch (error) {
      console.error('新建笔记失败:', error);
    }
  }





  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="p-6">
        {/* 统计卡片 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">总笔记数</p>
                  <h3 className="text-2xl font-bold mt-1">{notes.reduce((sum, note) => sum + note.page.length, 0)}</h3>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">总页面数</p>
                  <h3 className="text-2xl font-bold mt-1">{notes.reduce((sum, note) => sum + note.page.length, 0)}</h3>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <FileText className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">标签数量</p>
                  <h3 className="text-2xl font-bold mt-1">{allTags.length}</h3>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Tag className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>笔记列表</CardTitle>
              <CardDescription>管理和编辑所有学习笔记</CardDescription>
            </div>
            <Dialog>
              <form onSubmit={submitAddNote}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    <span>新建笔记</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>新建笔记</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name-1">标题</Label>
                      <Input id="name-1" name="name" onChange={(e) => setAddNotesPage({ ...addNotesPage, title: e.target.value })} />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="username-1">标签</Label>
                      <Input id="username-1" name="username" onChange={(e) => setAddNotesPage({ ...addNotesPage, tags: e.target.value.split(',') })} />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="username-1">创建时间</Label>
                      <Input id="username-1" name="username" type='date' className='w-40 flex items-center justify-center' onChange={(e) => setAddNotesPage({ ...addNotesPage, createdAt: e.target.value })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">添加</Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </CardHeader>




          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="搜索笔记标题或标签..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Select value={filterTags} onValueChange={setFilterTags}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="标签筛选" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部标签</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedNotes.length > 0 && selectedNotes.length === filteredAndSearchedPages.length}
                        onChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => {
                        setSortField('title');
                        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>标题</span>
                        {sortField === 'title' && (
                          sortDirection === 'asc' ?
                            <ChevronUp className="h-4 w-4" /> :
                            <ChevronDown className="h-4 w-4" />
                        )}
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
                    >
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>创建时间</span>
                        {sortField === 'createdAt' && (
                          sortDirection === 'asc' ?
                            <ChevronUp className="h-4 w-4" /> :
                            <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSearchedPages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        没有找到匹配的笔记
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedPages.map((page) => (
                      <TableRow key={page.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={selectedNotes.includes(page.id)}
                            onChange={() => {
                              if (selectedNotes.includes(page.id)) {
                                setSelectedNotes(selectedNotes.filter(id => id !== page.id));
                              } else {
                                setSelectedNotes([...selectedNotes, page.id]);
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {page.pageTags.map(tag => (
                              <Badge key={tag} variant="secondary" className="bg-[#F0F0F0] text-[#333333]">{tag}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(page.dateStart)}</TableCell>
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
                                <Link href={`/admin/study-nodes/edit/${page.id}`} className="w-full text-left">
                                  编辑
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400"
                                onClick={() => {
                                  setNoteToDelete(page.id);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                <span>删除</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                显示 {Math.min(1, filteredAndSearchedPages.length)} 到 {Math.min(10, filteredAndSearchedPages.length)} 条，共 {filteredAndSearchedPages.length} 条
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" disabled>上一页</Button>
                <Button size="sm" variant="default" disabled>1</Button>
                <Button size="sm" variant="ghost" disabled>下一页</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* 删除确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              此操作不可撤销，删除后笔记及其所有页面将无法恢复。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={() => {
              if (noteToDelete !== null) {
                // 这里可以添加实际的删除逻辑，当前暂时仅关闭对话框
                setIsDeleteDialogOpen(false);
                // 示例删除逻辑可根据实际需求添加，例如：
                // fetch(`/api/notes/${noteToDelete}`, { method: 'DELETE' })
                //   .then(() => {
                //     // 删除成功后重新获取数据
                //     fetchNotes();
                //   })
                //   .catch(error => {
                //     console.error('删除笔记失败:', error);
                //   });
              }
            }}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default StudyNodes;
