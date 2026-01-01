'use client'
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/shadcnComponents/forms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/shadcnComponents/forms/select';

export function FriendLinksSearch({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | 'active' | 'frozen';
  onStatusFilterChange: (value: 'all' | 'active' | 'frozen') => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="搜索友链名称或URL..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as "all" | "active" | "frozen")}>
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
  );
}

