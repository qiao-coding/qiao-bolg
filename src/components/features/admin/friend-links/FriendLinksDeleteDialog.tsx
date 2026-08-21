'use client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/shadcnComponents/overlay/dialog';
import { Button } from '@/components/ui/shadcnComponents/forms/button';

export function FriendLinksDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-md bg-card/95 border border-white/60 rounded-[28px] shadow-[0_24px_70px_rgba(255,132,189,0.14)] dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/95">
        <DialogHeader>
          <DialogTitle className="text-red-600 dark:text-red-400">确认删除</DialogTitle>
          <DialogDescription>
            您确定要删除这条友链吗？此操作无法撤销。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

