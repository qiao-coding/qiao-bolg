'use client';

import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Search,
  MoreHorizontal,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Filter,
  FileText
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/shadcnComponents/table';
import {
  Button
} from '@/components/ui/shadcnComponents/button';
import {
  Input
} from '@/components/ui/shadcnComponents/input';
import {
  Badge
} from '@/components/ui/shadcnComponents/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/shadcnComponents/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/shadcnComponents/dropdown-menu';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import Link from 'next/link';
import { motion } from 'framer-motion';

// 标签类型定义
interface TagType {
  id: string;
  name: string;
  articleCount: number;
  createTime: string;
  updateTime: string;
}

const mockTags: TagType[] = [
  {
    id: '1',
    name: 'React',
    articleCount: 18,
    createTime: '2024-01-15T10:30:00',
    updateTime: '2024-08-20T14:20:00'
  },
  {
    id: '2',
    name: 'JavaScript',
    articleCount: 15,
    createTime: '2024-01-20T09:15:00',
    updateTime: '2024-08-15T16:45:00'
  },
  {
    id: '3',
    name: 'TypeScript',
    articleCount: 12,
    createTime: '2024-02-05T14:20:00',
    updateTime: '2024-07-10T11:30:00'
  },
  {
    id: '4',
    name: 'Next.js',
    articleCount: 10,
    createTime: '2024-03-10T16:45:00',
    updateTime: '2024-08-05T10:15:00'
  },
  {
    id: '5',
    name: 'Tailwind CSS',
    articleCount: 8,
    createTime: '2024-04-15T11:30:00',
    updateTime: '2024-06-25T14:45:00'
  },
  {
    id: '6',
    name: 'CSS',
    articleCount: 14,
    createTime: '2024-02-20T15:40:00',
    updateTime: '2024-08-18T16:20:00'
  },
  {
    id: '7',
    name: '前端',
    articleCount: 20,
    createTime: '2024-01-10T09:20:00',
    updateTime: '2024-08-22T11:15:00'
  }
];

const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<TagType[]>(mockTags);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof TagType | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);

  // 过滤和搜索标签
  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTags = [...filteredTags].sort((a, b) => {
    if (!sortField) return 0;
    
    let valueA = a[sortField];
    let valueB = b[sortField];
    
    if (sortField === 'createTime' || sortField === 'updateTime') {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    }
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof TagType) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: zhCN });
    } catch {
      return dateString;
    }
  };

  const handleDeleteTag = () => {
    if (tagToDelete) {
      setTags(tags.filter(tag => tag.id !== tagToDelete));
      setIsDeleteDialogOpen(false);
      setTagToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex flex-col gap-4 py-4 px-6 md:gap-6 md:py-6 border-b mb-4">
        <div>
          <h1 className="text-2xl font-bold">标签管理</h1>
          <p className="text-muted-foreground">管理博客文章的标签</p>
        </div>
      </header>

      <div className="px-6 mb-6">
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/blog-management">
            <Button variant="ghost" size="sm" className="gap-1">
              <FileText className="h-4 w-4" />
              <span>文章管理</span>
            </Button>
          </Link>
          <Link href="/admin/blog-management/categories">
            <Button variant="ghost" size="sm" className="gap-1">
              <FileText className="h-4 w-4" />
              <span>分类管理</span>
            </Button>
          </Link>
          <Link href="/admin/blog-management/tags">
            <Button variant="default" size="sm" className="gap-1">
              <Tag className="h-4 w-4" />
              <span>标签管理</span>
            </Button>
          </Link>
        </div>
      </div>

      <main className="p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>标签列表</CardTitle>
              <CardDescription>管理和编辑博客文章标签</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  <span>添加标签</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加新标签</DialogTitle>
                  <DialogDescription>
                    创建一个新的博客文章标签
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">标签名称</label>
                    <Input placeholder="输入标签名称" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>
                    添加
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="搜索标签名称..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <motion.div 
              className="mb-8 flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {sortedTags.map(tag => (
                <Badge 
                  key={tag.id} 
                  variant="secondary" 
                  className="bg-[#F0F0F0] text-[#333333] hover:bg-blue-100 cursor-pointer py-1 px-3 text-sm"
                >
                  {tag.name} ({tag.articleCount})
                </Badge>
              ))}
            </motion.div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        <span>标签名称</span>
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>文章数量</span>
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('createTime')}
                    >
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>创建时间</span>
                        {sortField === 'createTime' && (
                          sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>更新时间</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTags.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        没有找到匹配的标签
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedTags.map((tag) => (
                      <TableRow key={tag.id}>
                        <TableCell className="font-medium">{tag.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {tag.articleCount} 篇文章
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(tag.createTime)}</TableCell>
                        <TableCell>{formatDate(tag.updateTime)}</TableCell>
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
                                <span>编辑</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600 dark:text-red-400"
                                onClick={() => {
                                  setTagToDelete(tag.id);
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
                显示 {Math.min(1, filteredTags.length)} 到 {Math.min(10, filteredTags.length)} 条，共 {filteredTags.length} 条
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              此操作不可撤销，删除后该标签将从所有文章中移除。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteTag}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagsPage;