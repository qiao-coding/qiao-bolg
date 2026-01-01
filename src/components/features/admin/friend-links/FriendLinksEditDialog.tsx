'use client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/shadcnComponents/overlay/dialog';
import { Input } from '@/components/ui/shadcnComponents/forms/input';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { Switch } from '@/components/ui/shadcnComponents/forms/switch';
import { FriendForm } from '@/types/friend/type';



export function FriendLinksEditDialog({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FriendForm;
  onFormChange: (data: FriendForm) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              value={formData.name}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">友链URL</label>
            <Input
              placeholder="请输入友链URL，以http(s)://开头"
              value={formData.url}
              onChange={(e) => onFormChange({ ...formData, url: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">头像URL（可选）</label>
            <Input
              placeholder="请输入头像图片URL"
              value={formData.avatar || ''}
              onChange={(e) => onFormChange({ ...formData, avatar: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">简介（可选）</label>
            <textarea
              placeholder="请输入友链简介"
              value={formData.bio || ''}
              onChange={(e) => onFormChange({ ...formData, bio: e.target.value })}
              className="min-h-[80px] w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 dark:text-slate-300">
              激活状态
            </label>
            <Switch
              checked={formData.status}
              onCheckedChange={(checked) => onFormChange({ ...formData, status: checked })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={!formData.name.trim() || !formData.url.trim()}
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

