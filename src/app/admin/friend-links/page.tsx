'use client'
import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Globe } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/shadcnComponents/card';
import { Button } from '@/components/ui/shadcnComponents/button';
import { FriendLinksStatsCards } from '@/components/features/admin/friend-links/FriendLinksStatsCards';
import { FriendLinksSearch } from '@/components/features/admin/friend-links/FriendLinksSearch';
import { FriendLinksTable } from '@/components/features/admin/friend-links/FriendLinksTable';
import { FriendLinksAddDialog } from '@/components/features/admin/friend-links/FriendLinksAddDialog';
import { FriendLinksEditDialog } from '@/components/features/admin/friend-links/FriendLinksEditDialog';
import { FriendLinksDeleteDialog } from '@/components/features/admin/friend-links/FriendLinksDeleteDialog';
import { FriendType } from '@/types/friend/type';


const FriendLinksManagement= () => {
    const [friends, setFriends] = useState<FriendType[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortField, setSortField] = useState<'createdAt' | 'name' | 'status' | null>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [newFriend, setNewFriend] = useState<{ name: string; url: string; avatar?: string; bio?: string; status: boolean }>({
        name: '',
        url: '',
        avatar: '',
        bio: '',
        status: true
    });
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [editItem, setEditItem] = useState<FriendType | null>(null);
    const [editFriend, setEditFriend] = useState<{ name: string; url: string; avatar?: string; bio?: string; status: boolean }>({
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


    // 获取友链数据(GET)
    useEffect(() => {
        const fetchFriends = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/friend', { method: 'GET', credentials: 'include' });

                if (!response.ok) {
                    throw new Error('Failed to fetch friend links');
                }

                const data = await response.json();
                const formattedItems: FriendType[] = data.map((item: FriendType) => ({
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

    const handleSortChange = (field: 'createdAt' | 'name' | 'status') => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    // 切换友链状态(PUT)
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

            const fetchFriends = async () => {
                try {
                    const response = await fetch('/api/friend', { method: 'GET', credentials: 'include' });
                    if (response.ok) {
                        const data = await response.json();
                        const formattedItems: FriendType[] = data.map((item: FriendType) => ({
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

    // 切换全选
    const toggleSelectAll = () => {
        if (selectedItems.length === filteredAndSearchedItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredAndSearchedItems.map(item => item.id));
        }
    };

    // 切换单个友链选择
    const toggleSelectItem = (id: number) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };


    // 添加新友链(POST)
    const handleAddItem = async () => {
        try {
            if (newFriend.name.trim() && newFriend.url.trim()) {
                const newItem: FriendType = {
                    id: friends.length + 1,
                    ...newFriend,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                setFriends([...friends, newItem]);
                setIsAddDialogOpen(false);

                const response = await fetch('/api/friend/post_friend', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newFriend)
                });
                if (!response.ok) {
                    throw new Error('Failed to post friend link');
                }
            }
            setNewFriend({ name: '', url: '', avatar: '', bio: '', status: true });
        } catch (error) {
            console.error('添加新友链失败:', error);

        }
    };

    // 编辑友链(PUT)
    const handleEditItem = async () => {
        try {
            if (!editItem || !editFriend.name.trim() || !editFriend.url.trim()) {
                return console.error('编辑友链失败: 缺少必要字段');
            }

            const updatedItems = friends.map(item =>
                item.id === editItem.id ? { ...item, ...editFriend, updatedAt: new Date().toISOString() } : item
            );
            setFriends(updatedItems);
            setIsEditDialogOpen(false);

            const response = await fetch('/api/friend/put_friend', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editItem.id, ...editFriend })
            });
            if (!response.ok) {
                throw new Error('Failed to update friend link');
            }

            setEditItem(null);
            setEditFriend({ name: '', url: '', avatar: '', bio: '', status: true });
        } catch (error) {
            console.error('编辑友链失败:', error);
        }
    };

    // 删除友链(DELETE)
    const handleDeleteItem = async () => {
        try {
            if (itemToDelete !== null) {
                const updatedItems = friends.filter(item => item.id !== itemToDelete);
                setFriends(updatedItems);
                setIsDeleteDialogOpen(false);

                const response = await fetch('/api/friend/delete_friend', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: itemToDelete })
                });
                if (!response.ok) {
                    throw new Error('Failed to delete friend link');
                }

                setItemToDelete(null);
            }
        } catch (error) {
            console.error('删除友链失败:', error);
        }
    };

    // 打开编辑友链弹窗
    const openEditDialog = (friend: FriendType) => {
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

    // 打开删除友链弹窗
    const openDeleteDialog = (id: number) => {
        setItemToDelete(id);
        setIsDeleteDialogOpen(true);
    };


    return (
        <div className="min-h-screen  bg-sky-100/60 dark:bg-slate-600/80 text-foreground">
            <main className="p-6">
                <FriendLinksStatsCards friends={friends} />

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
                                className="gap-1 p-4 text-white
                                 bg-sky-400/60 dark:bg-slate-500
                                 hover:bg-sky-400/80 dark:hover:bg-slate-400
                                 "
                                onClick={() => setIsAddDialogOpen(true)}
                            >
                                <Plus className="h-4 w-4" />
                                <span>添加友链</span>
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <FriendLinksSearch
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            statusFilter={statusFilter}
                            onStatusFilterChange={setStatusFilter}
                        />

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
                            <FriendLinksTable
                                friends={sortedItems}
                                selectedItems={selectedItems}
                                sortField={sortField}
                                sortDirection={sortDirection}
                                onToggleSelectAll={toggleSelectAll}
                                onToggleSelectItem={toggleSelectItem}
                                onToggleStatus={toggleFriendStatus}
                                onEdit={openEditDialog}
                                onDelete={openDeleteDialog}
                                onSortChange={handleSortChange}
                            />
                        )}

                        {filteredAndSearchedItems.length > 0 && (
                            <div className="flex items-center justify-between mt-6">
                                <div className="text-sm text-muted-foreground">
                                    显示 {Math.min(1, filteredAndSearchedItems.length)} 到 {Math.min(10, filteredAndSearchedItems.length)} 条，共 {filteredAndSearchedItems.length} 条
                                </div>
                                {selectedItems.length > 0 && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
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

            <FriendLinksAddDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                formData={newFriend}
                onFormChange={setNewFriend}
                onSubmit={handleAddItem}
            />

            <FriendLinksEditDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                formData={editFriend}
                onFormChange={setEditFriend}
                onSubmit={handleEditItem}
            />

            <FriendLinksDeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteItem}
            />
        </div>
    );
};

export default FriendLinksManagement;