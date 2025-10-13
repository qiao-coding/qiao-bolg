'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Filter
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

interface Category {
  id: string;
  name: string;
  description: string;
  articleCount: number;
  createTime: string;
  updateTime: string;
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: '前端开发',
    description: '关于前端开发的文章，包括HTML、CSS、JavaScript等技术',
    articleCount: 24,
    createTime: '2024-01-15T10:30:00',
    updateTime: '2024-08-20T14:20:00'
  },
  {
    id: '2',
    name: '前端框架',
    description: '关于React、Vue、Angular等前端框架的文章',
    articleCount: 18,
    createTime: '2024-01-20T09:15:00',
    updateTime: '2024-08-15T16:45:00'
  },
  {
    id: '3',
    name: 'CSS框架',
    description: '关于Tailwind CSS、Bootstrap等CSS框架的文章',
    articleCount: 12,
    createTime: '2024-02-05T14:20:00',
    updateTime: '2024-07-10T11:30:00'
  },
  {
    id: '4',
    name: '职业发展',
    description: '关于前端工程师职业规划和发展的文章',
    articleCount: 8,
    createTime: '2024-03-10T16:45:00',
    updateTime: '2024-08-05T10:15:00'
  },
  {
    id: '5',
    name: '其他',
    description: '其他类型的文章',
    articleCount: 5,
    createTime: '2024-04-15T11:30:00',
    updateTime: '2024-06-25T14:45:00'
  }
];

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Category | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
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

  const handleSort = (field: keyof Category) => {
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

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(category => category.id !== categoryToDelete));
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex flex-col gap-4 py-4 px-6 md:gap-6 md:py-6 border-b mb-4">
        <div>
          <h1 className="text-2xl font-bold">分类管理</h1>
          <p className="text-muted-foreground">管理博客文章的分类</p>
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
            <Button variant="default" size="sm" className="gap-1">
              <FileText className="h-4 w-4" />
              <span>分类管理</span>
            </Button>
          </Link>
          <Link href="/admin/blog-management/tags">
            <Button variant="ghost" size="sm" className="gap-1">
              <FileText className="h-4 w-4" />
              <span>标签管理</span>
            </Button>
          </Link>
        </div>
      </div>

      <main className="p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>分类列表</CardTitle>
              <CardDescription>管理和编辑博客文章分类</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  <span>添加分类</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加新分类</DialogTitle>
                  <DialogDescription>
                    创建一个新的博客文章分类
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">分类名称</label>
                    <Input placeholder="输入分类名称" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">分类描述</label>
                    <textarea
                      className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="输入分类描述"
                    />
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
                  placeholder="搜索分类名称或描述..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>分类名称</span>
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
                        <span>描述</span>
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
                  {sortedCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        没有找到匹配的分类
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {category.articleCount} 篇文章
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(category.createTime)}</TableCell>
                        <TableCell>{formatDate(category.updateTime)}</TableCell>
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
                                  setCategoryToDelete(category.id);
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
                显示 {Math.min(1, filteredCategories.length)} 到 {Math.min(10, filteredCategories.length)} 条，共 {filteredCategories.length} 条
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
              此操作不可撤销，删除后该分类下的文章将被移动到默认分类。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesPage;