'use client'
import React, { useEffect, useState } from 'react';
import { Search, Plus, MoreHorizontal, Edit3, Trash2, Eye, ChevronDown, ChevronUp, Globe, User, Clock, CheckCircle2, Circle, Badge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/shadcnComponents/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/shadcnComponents/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/shadcnComponents/table';
import { Input } from '@/components/ui/shadcnComponents/input';
import { Button } from '@/components/ui/shadcnComponents/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/shadcnComponents/dialog';
import { Switch } from '@/components/ui/shadcnComponents/switch';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/shadcnComponents/select';

interface Friend {
    id: number;
    name: string;
    url: string;
    avatar?: string;
    bio?: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}

const FriendLinksManagement: React.FC = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortField, setSortField] = useState<'createdAt' | 'name' | 'status' | null>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [newFriend, setNewFriend] = useState<Omit<Friend, 'id' | 'createdAt' | 'updatedAt'>>({
        name: '',
        url: '',
        avatar: '',
        bio: '',
        status: true
    });
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [editItem, setEditItem] = useState<Friend | null>(null);
    const [editFriend, setEditFriend] = useState<Omit<Friend, 'id' | 'createdAt' | 'updatedAt'>>({
        name: '',
        url: '',
        avatar: '',
        bio: '',
        status: true
    });


    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'frozen'>('all');


    // 过滤和搜索判断
    const filteredAndSearchedItems = friends.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
        || item.url.toLowerCase().includes(searchTerm.toLowerCase())
        || (item.bio && item.bio.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    useEffect(() => {
        const fetchFriends = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/friend', { method: 'GET', credentials: 'include' });

                if (!response.ok) {
                    throw new Error('Failed to fetch friend links');
                }

                const data = await response.json();
                const formattedItems: Friend[] = data.map((item: Friend) => ({
                    ...item,
                    status: item.status !== undefined ? item.status : true
                }));
                setFriends(formattedItems);
            } catch (error) {
                console.error('获取友链数据失败:', error);

            } finally {
                setIsLoading(false);
            }
        };

        fetchFriends();

        const handleAuthChange = () => fetchFriends();
        window.addEventListener('authChange', handleAuthChange);

        return () => {
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    const activeItems = filteredAndSearchedItems.filter(item => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'active') return item.status === true;
        if (statusFilter === 'frozen') return item.status === false;
        return true;
    });


    // 排序友链
    const sortedItems = [...activeItems].sort((a, b) => {
        if (!sortField) return 0;

        if (sortField === 'createdAt') {
            const valueA = new Date(a.createdAt).getTime();
            const valueB = new Date(b.createdAt).getTime();

            if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        } else if (sortField === 'name') {
            const valueA = a.name.toLowerCase();
            const valueB = b.name.toLowerCase();

            if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        } else if (sortField === 'status') {
            if (a.status && !b.status) return -1;
            if (!a.status && b.status) return 1;
        }
        return 0;
    });

    // 切换友链状态
    const toggleFriendStatus = async (id: number) => {
        try {
            const friend = friends.find(f => f.id === id);
            if (!friend) return;
            const newStatus = !friend.status;
            const updatedItems = friends.map(item =>
                item.id === id ? { ...item, status: newStatus, updatedAt: new Date().toISOString() } : item
            );
            setFriends(updatedItems);

            const response = await fetch('/api/friend/put_status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: friend.id, status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to toggle friend status');
            }
        } catch (error) {
            console.error('切换友链状态失败:', error);

            // 重试获取友链数据
            const fetchFriends = async () => {
                try {
                    const response = await fetch('/api/friend', { method: 'GET', credentials: 'include' });
                    if (response.ok) {
                        const data = await response.json();
                        const formattedItems: Friend[] = data.map((item: Friend) => ({
                            ...item,
                            status: item.status !== undefined ? item.status : true
                        }));
                        setFriends(formattedItems);
                    }
                } catch (retryError) {
                    console.error('重试获取友链数据失败:', retryError);
                }
            };

            fetchFriends();
        }
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === filteredAndSearchedItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredAndSearchedItems.map(item => item.id));
        }
    };

    const toggleSelectItem = (id: number) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: zhCN });
        } catch {
            return dateString;
        }
    };

    // 添加新友链
    const handleAddItem = async () => {
        try {
            if (newFriend.name.trim() && newFriend.url.trim()) {
                const newItem: Friend = {
                    id: friends.length + 1,
                    ...newFriend,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                setFriends([...friends, newItem]);
                setIsAddDialogOpen(false);

                // 发送到服务器
                const response = await fetch('/api/friend/post_friend', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newFriend)
                });
                if (!response.ok) {
                    throw new Error('Failed to post friend link');
                }
            }
            // 重置表单
            setNewFriend({ name: '', url: '', avatar: '', bio: '', status: true });
        } catch (error) {
            console.error('添加新友链失败:', error);

        }
    };

    // 编辑友链
    const handleEditItem = async () => {
        try {
            if (!editItem || !editFriend.name.trim() || !editFriend.url.trim()) {
                return console.error('编辑友链失败: 缺少必要字段');
            }

            // 本地更新
            const updatedItems = friends.map(item =>
                item.id === editItem.id ? { ...item, ...editFriend, updatedAt: new Date().toISOString() } : item
            );
            setFriends(updatedItems);
            setIsEditDialogOpen(false);

            // 发送到服务器
            const response = await fetch('/api/friend/put_friend', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editItem.id, ...editFriend })
            });
            if (!response.ok) {
                throw new Error('Failed to update friend link');
            }

            // 重置表单
            setEditItem(null);
            setEditFriend({ name: '', url: '', avatar: '', bio: '', status: true });
        } catch (error) {
            console.error('编辑友链失败:', error);
        }
    };

    // 删除友链
    const handleDeleteItem = async () => {
        try {
            if (itemToDelete !== null) {
                // 本地更新
                const updatedItems = friends.filter(item => item.id !== itemToDelete);
                setFriends(updatedItems);
                setIsDeleteDialogOpen(false);

                // 发送到服务器
                const response = await fetch('/api/friend/delete_friend', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: itemToDelete })
                });
                if (!response.ok) {
                    throw new Error('Failed to delete friend link');
                }

                // 重置删除状态
                setItemToDelete(null);
            }
        } catch (error) {
            console.error('删除友链失败:', error);
        }
    };

    // 打开编辑对话框
    const openEditDialog = (friend: Friend) => {
        setEditItem(friend);
        setEditFriend({
            name: friend.name,
            url: friend.url,
            avatar: friend.avatar || '',
            bio: friend.bio || '',
            status: friend.status
        });
        setIsEditDialogOpen(true);
    };

    // 打开删除对话框
    const openDeleteDialog = (id: number) => {
        setItemToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    // 渲染排序图标
    const renderSortIcon = (field: 'createdAt' | 'name' | 'status') => {
        if (sortField !== field) {
            return <ChevronDown className="h-4 w-4 opacity-30" />;
        }
        return sortDirection === 'asc' ?
            <ChevronUp className="h-4 w-4" /> :
            <ChevronDown className="h-4 w-4" />;
    };

    const activeCount = friends.filter(friend => friend.status).length;
    const latestFriend = friends.length > 0 ?
        friends.reduce((latest, current) =>
            new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
        ) : null;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="p-6">
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
                                    <p className="text-sm font-medium text-muted-foreground">总友链数</p>
                                    <h3 className="text-2xl font-bold mt-1">{friends.length}</h3>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                                    <Globe className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">激活友链</p>
                                    <h3 className="text-2xl font-bold mt-1">{activeCount}</h3>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-300" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">最近添加</p>
                                    <h3 className="text-2xl font-bold mt-1">
                                        {latestFriend ? formatDate(latestFriend.createdAt) : '暂无'}
                                    </h3>
                                </div>
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                                    <Clock className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle>友链列表</CardTitle>
                            <CardDescription>管理您的友情链接，支持添加、编辑和删除操作</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href="/friend"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center"
                            >
                            </Link>
                            <Button
                                size="sm"
                                className="gap-1 p-4 text-white"
                                onClick={() => setIsAddDialogOpen(true)}
                            >
                                <Plus className="h-4 w-4" />
                                <span>添加友链</span>
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="搜索友链名称或URL..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />


                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | "active" | "frozen")}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="全部状态" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">全部</SelectItem>
                                        <SelectItem value="active">激活</SelectItem>
                                        <SelectItem value="frozen">冻结</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center p-12">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                                    <p className="text-slate-500 dark:text-slate-400">加载中...</p>
                                </div>
                            </div>
                        ) : filteredAndSearchedItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <Globe className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">暂无友链</h3>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                        <TableRow>
                                            <TableHead className="w-[40px]">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.length > 0 && selectedItems.length === filteredAndSearchedItems.length}
                                                    onChange={toggleSelectAll}
                                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </TableHead>
                                            <TableHead className="w-[150px]">友链名称</TableHead>
                                            <TableHead className="hidden md:table-cell">URL</TableHead>
                                            <TableHead className="hidden lg:table-cell max-w-[200px]">简介</TableHead>
                                            <TableHead
                                                className="w-[100px] cursor-pointer"
                                                onClick={() => {
                                                    if (sortField === 'status') {
                                                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                                    } else {
                                                        setSortField('status');
                                                        setSortDirection('desc');
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center gap-1">
                                                    {renderSortIcon('status')}
                                                    状态
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="w-[150px] cursor-pointer"
                                                onClick={() => {
                                                    if (sortField === 'createdAt') {
                                                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                                    } else {
                                                        setSortField('createdAt');
                                                        setSortDirection('desc');
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    创建时间
                                                    {renderSortIcon('createdAt')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="w-[100px] text-right">操作</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedItems.map((friend) => (
                                            <TableRow
                                                key={friend.id}
                                                className={`group border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${!friend.status ? 'opacity-60' : ''}`}
                                            >
                                                <TableCell>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.includes(friend.id)}
                                                        onChange={() => toggleSelectItem(friend.id)}
                                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {friend.avatar ? (
                                                            <img
                                                                src={friend.avatar}
                                                                alt={friend.name}
                                                                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                                                <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                            </div>
                                                        )}
                                                        <span className="text-slate-900 dark:text-white">{friend.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <a
                                                        href={friend.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 dark:text-indigo-400 hover:underline line-clamp-1"
                                                    >
                                                        {friend.url}
                                                    </a>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell text-slate-500 dark:text-slate-400 line-clamp-2">
                                                    {friend.bio || '暂无简介'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Switch
                                                            id={`status-${friend.id}`}
                                                            checked={friend.status}
                                                            onCheckedChange={() => toggleFriendStatus(friend.id)}
                                                        />
                                                        <label
                                                            htmlFor={`status-${friend.id}`}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 dark:text-slate-400"
                                                        >
                                                            {friend.status ? '激活' : '停用'}
                                                        </label>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-500 dark:text-slate-400 text-sm">
                                                    {formatDate(friend.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <span className="sr-only">打开菜单</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => openEditDialog(friend)}
                                                                className="cursor-pointer"
                                                            >
                                                                <Edit3 className="h-4 w-4 mr-2" />
                                                                <span>编辑</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => toggleFriendStatus(friend.id)}
                                                                className="cursor-pointer"
                                                            >
                                                                {friend.status ? (
                                                                    <> <Circle className="h-4 w-4 mr-2" /> <span>停用</span> </>
                                                                ) : (
                                                                    <> <CheckCircle2 className="h-4 w-4 mr-2" /> <span>激活</span> </>
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => openDeleteDialog(friend.id)}
                                                                className="cursor-pointer text-red-600 dark:text-red-400"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                <span>删除</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {/* 分页信息 */}
                        {filteredAndSearchedItems.length > 0 && (
                            <div className="flex items-center justify-between mt-6">
                                <div className="text-sm text-muted-foreground">
                                    显示 {Math.min(1, filteredAndSearchedItems.length)} 到 {Math.min(10, filteredAndSearchedItems.length)} 条，共 {filteredAndSearchedItems.length} 条
                                </div>
                                {selectedItems.length > 0 && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            // 这里可以添加批量删除功能
                                            console.log('批量删除选中的', selectedItems.length, '条友链');
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        批量删除
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>添加新友链</DialogTitle>
                        <DialogDescription>
                            填写友链信息，添加到您的友情链接列表中
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">友链名称</label>
                            <Input
                                placeholder="请输入友链名称"
                                value={newFriend.name}
                                onChange={(e) => setNewFriend({ ...newFriend, name: e.target.value })}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">友链URL</label>
                            <Input
                                placeholder="请输入友链URL，以http(s)://开头"
                                value={newFriend.url}
                                onChange={(e) => setNewFriend({ ...newFriend, url: e.target.value })}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">头像URL（可选）</label>
                            <Input
                                placeholder="请输入头像图片URL"
                                value={newFriend.avatar}
                                onChange={(e) => setNewFriend({ ...newFriend, avatar: e.target.value })}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">简介（可选）</label>
                            <textarea
                                placeholder="请输入友链简介"
                                value={newFriend.bio}
                                onChange={(e) => setNewFriend({ ...newFriend, bio: e.target.value })}
                                className="min-h-[80px] w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 dark:text-slate-300">
                                激活状态
                            </label>
                            <Switch
                                checked={newFriend.status}
                                onCheckedChange={(checked) => setNewFriend({ ...newFriend, status: checked })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setIsAddDialogOpen(false)}
                        >
                            取消
                        </Button>
                        <Button
                            onClick={handleAddItem}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            disabled={!newFriend.name.trim() || !newFriend.url.trim()}
                        >
                            添加
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 编辑友链对话框 */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>编辑友链</DialogTitle>
                        <DialogDescription>
                            修改友链信息，更新到您的友情链接列表中
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">友链名称</label>
                            <Input
                                placeholder="请输入友链名称"
                                value={editFriend.name}
                                onChange={(e) => setEditFriend({ ...editFriend, name: e.target.value })}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">友链URL</label>
                            <Input
                                placeholder="请输入友链URL，以http(s)://开头"
                                value={editFriend.url}
                                onChange={(e) => setEditFriend({ ...editFriend, url: e.target.value })}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">头像URL（可选）</label>
                            <Input
                                placeholder="请输入头像图片URL"
                                value={editFriend.avatar}
                                onChange={(e) => setEditFriend({ ...editFriend, avatar: e.target.value })}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">简介（可选）</label>
                            <textarea
                                placeholder="请输入友链简介"
                                value={editFriend.bio}
                                onChange={(e) => setEditFriend({ ...editFriend, bio: e.target.value })}
                                className="min-h-[80px] w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 dark:text-slate-300">
                                激活状态
                            </label>
                            <Switch
                                checked={editFriend.status}
                                onCheckedChange={(checked) => setEditFriend({ ...editFriend, status: checked })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            取消
                        </Button>
                        <Button
                            onClick={handleEditItem}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            disabled={!editFriend.name.trim() || !editFriend.url.trim()}
                        >
                            保存
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 删除友链对话框 */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600 dark:text-red-400">确认删除</DialogTitle>
                        <DialogDescription>
                            您确定要删除这条友链吗？此操作无法撤销。
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            取消
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteItem}
                        >
                            删除
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FriendLinksManagement;