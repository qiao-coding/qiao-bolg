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
  Clock,
  MessageCircle
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
  Input
} from '@/components/ui/shadcnComponents/input';
import {
  Badge
} from '@/components/ui/shadcnComponents/badge';
import {
  Button
} from '@/components/ui/shadcnComponents/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/shadcnComponents/dialog';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import Link from 'next/link';

// 根据 Prisma 模型定义的说说类型
interface Miscellaneous {
  id: number;
  content: string;
  date: string;
}

const MiscellaneousManagement: React.FC = () => {
  const [miscellaneous, setMiscellaneous] = useState<Miscellaneous[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<'date' | null>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<Miscellaneous | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  // 过滤和搜索说说
  const filteredAndSearchedItems = miscellaneous.filter(item =>
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 获取说说数据
  useEffect(() => {
    const fetchMiscellaneous = async () => {
      try {
        const response = await fetch('/api/miscellaneous', { method: 'GET', credentials: 'include' });

        if (!response.ok) {
          throw new Error('Failed to fetch miscellaneous items');
        }

        const data = await response.json();
        const formattedItems: Miscellaneous[] = data.map((item: Miscellaneous) => ({
          id: item.id,
          content: item.content,
          date: item.date
        }));
        setMiscellaneous(formattedItems);
      } catch (error) {
        console.error('获取说说数据失败:', error);
        const mockData: Miscellaneous[] = [
          {
            id: 1,
            content: '加载失败',
            date: new Date().toISOString()
          },

        ];
        setMiscellaneous(mockData);
      }
    };

    fetchMiscellaneous();

    // 事件监听器和清理函数
    const handleAuthChange = () => fetchMiscellaneous();
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // 排序说说
  const sortedItems = [...filteredAndSearchedItems].sort((a, b) => {
    if (!sortField) return 0;

    // 根据日期字段进行排序
    const valueA = new Date(a.date).getTime();
    const valueB = new Date(b.date).getTime();

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredAndSearchedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredAndSearchedItems.map(item => item.id));
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


  //添加说说
  const handleAddItem = async () => {
    try {
      if (newContent.trim()) {
        const newItem: Miscellaneous = {
          id: miscellaneous.length + 1,
          content: newContent,
          date: new Date().toISOString().slice(0, 10),
        };
        setMiscellaneous([...miscellaneous, newItem]);
        setIsAddDialogOpen(false);



        const response = await fetch('/api/miscellaneous/post_miscellaneous', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
        if (!response.ok) {
          throw new Error('Failed to post miscellaneous item');
        }
      }
      setNewContent('');

    } catch (error) {
      return console.error('添加新说说失败:', error);

    }
  };

  // 编辑说说
  const handleEditItem = async () => {
    try {
      if (!editItem || !editContent.trim()) {
        return console.error('编辑说说失败: 缺少必要字段');
      }

      const newEditItem: Miscellaneous = {
        id: editItem.id,
        content: editContent,
        date: format(new Date(), 'yyyy-MM-dd', { locale: zhCN })
      };

      const updatedItems = miscellaneous.map(item =>
        item.id === editItem.id ? { ...item, content: editContent } : item
      );

      console.log(updatedItems);
      console.log(editItem);


      setMiscellaneous(updatedItems);
      setIsEditDialogOpen(false);



      const response = await fetch('/api/miscellaneous/put_miscellaneous', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEditItem)
      });


      if (!response.ok) {
        throw new Error('Failed to patch miscellaneous item');
      }
      setEditItem(null);
      setEditContent('');


    } catch (error) {
      return console.error('编辑说说失败:', error);

    }
  };

  // 删除说说
  const handleDeleteItem = async () => {
    try {
      if (itemToDelete !== null) {
        const updatedItems = miscellaneous.filter(item => item.id !== itemToDelete);
        setMiscellaneous(updatedItems);
        console.log(itemToDelete);
        setIsDeleteDialogOpen(false);



        const response = await fetch('/api/miscellaneous/delete_miscellaneous', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: itemToDelete })
        });
        if (!response.ok) {
          throw new Error('Failed to delete miscellaneous item');
        }

        setItemToDelete(null);
      }


    } catch (error) {

    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="p-6">
        {/* 统计卡片 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">总说说数</p>
                  <h3 className="text-2xl font-bold mt-1">{miscellaneous.length}</h3>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">最近说说</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {miscellaneous.length > 0 ?
                      formatDate(miscellaneous.reduce((latest, current) =>
                        new Date(current.date) > new Date(latest.date) ? current : latest
                      ).date) :
                      '暂无'}
                  </h3>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <Clock className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>

        </motion.div>

        {/* 说说管理区域 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>说说列表</CardTitle>
            </div>
            <Button
              size="sm"
              className="gap-1"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>发布说说</span>
            </Button>
          </CardHeader>

          <CardContent>
            {/* 搜索 */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="搜索说说内容..."
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
                    <TableHead className="w-[40px]">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedItems.length > 0 && selectedItems.length === filteredAndSearchedItems.length}
                        onChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-full">内容</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => {
                        setSortField('date');
                        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>发布时间</span>
                        {sortField === 'date' && (
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
                  {filteredAndSearchedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        没有找到匹配的说说
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => {
                              if (selectedItems.includes(item.id)) {
                                setSelectedItems(selectedItems.filter(id => id !== item.id));
                              } else {
                                setSelectedItems([...selectedItems, item.id]);
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell className="max-w-md overflow-hidden text-ellipsis whitespace-nowrap">{item.content}</TableCell>
                        <TableCell>{formatDate(item.date)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">打开菜单</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditItem(item);
                                  setEditContent(item.content);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit3 className="h-4 w-4 mr-2" />
                                <span>编辑</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400"
                                onClick={() => {
                                  setItemToDelete(item.id);
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

            {/* 分页控制 */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                显示 {Math.min(1, filteredAndSearchedItems.length)} 到 {Math.min(10, filteredAndSearchedItems.length)} 条，共 {filteredAndSearchedItems.length} 条
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* 添加说说对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>发布新说说</DialogTitle>
            <DialogDescription>
              分享你的想法和感悟
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <textarea
              placeholder="请输入说说内容..."
              className="w-full p-3 border rounded-md resize-none h-32"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddItem} disabled={!newContent.trim()}>
              发布
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑说说对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑说说</DialogTitle>
            <DialogDescription>
              修改你的说说内容
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <textarea
              placeholder="请输入说说内容..."
              className="w-full p-3 border rounded-md resize-none h-32"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleEditItem} disabled={!editContent.trim()}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              此操作不可撤销，删除后说说将无法恢复。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MiscellaneousManagement;
