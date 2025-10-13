'use client';

import React, { useEffect, useState } from 'react';
import UpImg from '../../../../../public/UserImage/up.jpg'
import {
  Users,
  User,
  Shield,
  MessageSquare,
  Search,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Ban,
  AlertTriangle,
  Plus
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/shadcnComponents/dropdown-menu';
import {
  Button
} from '@/components/ui/shadcnComponents/button';
import {
  Badge
} from '@/components/ui/shadcnComponents/badge';
import {
  Input
} from '@/components/ui/shadcnComponents/input';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/shadcnComponents/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcnComponents/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/shadcnComponents/select';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import UserQuickNavigation from '@/components/ui/adminComponents/userQuickNavigation';

// 用户类型定义
interface User {
  id: string;
  username: string;
  createdAt: string;
}


export type {User}

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    username: 'zhangsan@example.com',
    createdAt: '2024-01-15T10:30:00',
  },
];


// 状态标签样式映射
const statusBadgeStyles = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  banned: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

// 状态图标映射
const statusIcons = {
  active: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  inactive: <Clock className="h-4 w-4 text-gray-500" />,
  banned: <Ban className="h-4 w-4 text-red-500" />
};

// 修改页面顶部导入

// 将整个组件修改为异步组件，直接在组件内部获取数据
const RegularUsersPage: React.FC = () => {
  const [statusType] = useState<'active' | 'inactive' | 'banned'>('active');
  // 保留模拟数据作为回退
  const [users, setUsers] = useState<User[]|null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);


  // 保持现有的useEffect数据获取逻辑不变

  useEffect(()=>{
    const userFecth=async()=>{
      try {
        const res=await fetch('/api/admin/adminUser',{
          method:'GET',
          credentials:'include'
        })
        if(!res.ok)return console.error('获取管理员用户列表失败');
        const data=await res.json()
        setUsers(data)
      } catch (error) {
        console.error(error)
        
      }
    }
    userFecth()
    //要侦听认证状态变化的事件，以便在用户登录或登出时重新获取数据
    const handleAuthChange=()=>{
      console.log('用户登录状态发生变化，重新获取数据');
      userFecth()

      window.addEventListener('authChange',handleAuthChange)

      return ()=>{
        window.removeEventListener('authChange',handleAuthChange)
      }
    }
  },[])
  // 过滤和搜索用户
  const filteredUsers= users&& users.filter(user => {
    const matchesSearch = user.username ? user.username.toLowerCase().includes(searchTerm.toLowerCase()) : false;
                          
    const matchesStatus = filterStatus === 'all' || statusType === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // 排序用户

  const sortedUsers =  filteredUsers ? [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;
    
    let valueA = a[sortField];
    let valueB = b[sortField];
    
    // 特殊处理日期类型
    if (sortField === 'createdAt') {
       valueA = new Date(valueA).getTime().toString();
       valueB = new Date(valueB).getTime().toString();
    }
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  }):[]

  // 处理排序
 

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: zhCN });
    } catch {
      return dateString;
    }
  };

  // 切换用户选择
  const toggleUserSelection = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) 
        ? prev.filter(userId => userId !== id) 
        : [...prev, id]
    );
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedUsers.length === sortedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(sortedUsers.map(user => user.id));
    }
  };

  // 处理用户删除
  const handleDeleteUser = () => {
    if (userToDelete) {
      setUsers(users ? users.filter(user => user.id !== userToDelete) : null);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // 批量操作处理
  const handleBulkOperation = (operation: 'delete' | 'activate' | 'deactivate' | 'ban') => {
    if (selectedUsers.length === 0) return;
    
    switch (operation) {
      case 'delete':
        setUsers(users&& users.filter(user => !selectedUsers.includes(user.id)));
        break;
      case 'activate':
        setUsers(users&& users.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user
        ));
        break;
      case 'deactivate':
        setUsers(users&& users.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'inactive' } : user
        ));
        break;
      case 'ban':
        setUsers(users&& users.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'banned' } : user
        ));
        break;
    }
    
    setSelectedUsers([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 页面标题 */}
      <header className="flex flex-col gap-4 py-4 px-6 md:gap-6 md:py-6 border-b mb-4">
        <div>
          <h1 className="text-2xl font-bold">管理员用户管理</h1>
          <p className="text-muted-foreground">管理和查看所有管理员用户</p>
        </div>
      </header>

      {/* 快速导航 */}
      <UserQuickNavigation/>

      <main className="p-6">
        {/* 用户管理卡片 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>用户列表</CardTitle>
              <CardDescription>管理和编辑所有普通用户</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* 批量操作下拉菜单 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1" disabled={selectedUsers.length === 0}>
                    <Filter className="h-4 w-4" />
                    <span>批量操作 ({selectedUsers.length})</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleBulkOperation('activate')}>启用用户</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkOperation('deactivate')}>禁用用户</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkOperation('ban')}>封禁用户</DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600 dark:text-red-400"
                    onClick={() => handleBulkOperation('delete')}
                  >
                    删除用户
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                <span>添加用户</span>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* 搜索和筛选 */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="搜索用户名或邮箱..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="active">已启用</SelectItem>
                    <SelectItem value="inactive">已禁用</SelectItem>
                    <SelectItem value="banned">已封禁</SelectItem>
                  </SelectContent>
                </Select>
                
              </div>
            </div>

            {/* 用户表格 */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedUsers.length > 0 && sortedUsers && selectedUsers.length === sortedUsers.length}
                        onChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>用户信息</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>状态</span>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>注册日期</span>
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      // onClick={() => handleSort('lastActivity')}
                    >
                    </TableHead>


                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        没有找到匹配的用户
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={UpImg.src} alt={user.username} />
                              <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {statusIcons[statusType as keyof typeof statusIcons]}
                            <Badge className={statusBadgeStyles[statusType]}>
                              {statusType === 'active' ? '已启用' : 
                               statusType === 'inactive' ? '已禁用' : '已封禁'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                        </TableCell>
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
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                <span>查看详情</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setUsers(users&& users.map(u => 
                                  u.id === user.id ? { ...u, status: statusType === 'active' ? 'inactive' : 'active' } : u
                                ));
                              }}>
                                <span>{statusType === 'active' ? '禁用' : '启用'}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600 dark:text-red-400"
                                onClick={() => {
                                  setUserToDelete(user.id);
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
                显示 {users && filteredUsers ? Math.min(1, filteredUsers.length) : 0} 到 {filteredUsers ? Math.min(10, filteredUsers.length) : 0} 条，共 {filteredUsers ? filteredUsers.length : 0} 条
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
            <DialogTitle>确认删除用户</DialogTitle>
            <DialogDescription>
              此操作不可撤销，删除后用户数据将无法恢复。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <p className="text-sm">删除用户将同时删除其所有文章、评论和相关数据。</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegularUsersPage;