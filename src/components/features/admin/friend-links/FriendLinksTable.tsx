'use client'
import { MoreHorizontal, Edit3, Trash2, ChevronDown, ChevronUp, Clock, User, CheckCircle2, Circle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/shadcnComponents/data-display/table';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/shadcnComponents/overlay/dropdown-menu';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { FriendType } from '@/types/friend/type';


export function FriendLinksTable({
  friends,
  selectedItems,
  sortField,
  sortDirection,
  onToggleSelectAll,
  onToggleSelectItem,
  onEdit,
  onDelete,
  onSortChange,
}: {
  friends: FriendType[];
  selectedItems: number[];
  sortField: 'createdAt' | 'name' | 'status' | null;
  sortDirection: 'asc' | 'desc';
  onToggleSelectAll: () => void;
  onToggleSelectItem: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onEdit: (friend: FriendType) => void;
  onDelete: (id: number) => void;
  onSortChange: (field: 'createdAt' | 'name' | 'status') => void;
}) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: zhCN });
    } catch {
      return dateString;
    }
  };

  const renderSortIcon = (field: 'createdAt' | 'name' | 'status') => {
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
        <TableHeader className="bg-slate-50 dark:bg-slate-900">
          <TableRow>
            <TableHead className="w-[40px]">
              <input
                type="checkbox"
                checked={selectedItems.length > 0 && selectedItems.length === friends.length}
                onChange={onToggleSelectAll}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </TableHead>
            <TableHead className="w-[150px]">友链名称</TableHead>
            <TableHead className="hidden md:table-cell">URL</TableHead>
            <TableHead className="hidden lg:table-cell max-w-[200px]">简介</TableHead>

            <TableHead
              className="w-[150px] cursor-pointer"
              onClick={() => onSortChange('createdAt')}
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
          {friends.map((friend) => (
            <TableRow
              key={friend.id}
              className={`group border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${!friend.status ? 'opacity-60' : ''}`}
            >
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(friend.id)}
                  onChange={() => onToggleSelectItem(friend.id)}
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
                      onClick={() => onEdit(friend)}
                      className="cursor-pointer"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      <span>编辑</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(friend.id)}
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
  );
}

