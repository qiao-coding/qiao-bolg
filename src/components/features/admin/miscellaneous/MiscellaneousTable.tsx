'use client'
import { MoreHorizontal, Edit3, Trash2, Calendar, ChevronUp, ChevronDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/shadcnComponents/data-display/table';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/shadcnComponents/overlay/dropdown-menu';
import { motion } from 'framer-motion';
import { Miscellaneous } from '@/types/miscellaneous/type';

export function MiscellaneousTable({
  items,
  selectedItems,
  sortField,
  sortDirection,
  onToggleSelectAll,
  onToggleSelectItem,
  onEdit,
  onDelete,
  onSortChange,
}: {
  items: Miscellaneous[];
  selectedItems: number[];
  sortField: 'date' | null;
  sortDirection: 'asc' | 'desc';
  onToggleSelectAll: () => void;
  onToggleSelectItem: (id: number) => void;
  onEdit: (item: Miscellaneous) => void;
  onDelete: (id: number) => void;
  onSortChange: () => void;
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                checked={selectedItems.length > 0 && selectedItems.length === items.length}
                onChange={onToggleSelectAll}
              />
            </TableHead>
            <TableHead className="w-full">内容</TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={onSortChange}
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
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                没有找到匹配的说说
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <motion.tr 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => onToggleSelectItem(item.id)}
                  />
                </TableCell>
                <TableCell className="max-w-md overflow-hidden text-ellipsis whitespace-nowrap">{item.content}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                        <span className="sr-only">打开菜单</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-24">
                      <DropdownMenuItem
                        onClick={() => onEdit(item)}
                        className="cursor-pointer hover:bg-muted"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        <span>编辑</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400 cursor-pointer hover:bg-muted"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span>删除</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

