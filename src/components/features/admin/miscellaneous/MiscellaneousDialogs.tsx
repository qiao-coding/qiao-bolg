'use client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/shadcnComponents/overlay/dialog';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { Textarea } from '@/components/ui/shadcnComponents/forms/textarea';
import { motion } from 'framer-motion';

export function MiscellaneousAddDialog({
  open,
  onOpenChange,
  content,
  onContentChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md backdrop-blur-md bg-card/95 border border-white/60 rounded-[28px] shadow-[0_24px_70px_rgba(255,132,189,0.14)] dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/95">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle>发布新说说</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              placeholder="请输入说说内容..."
              className="resize-none min-h-[120px]"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={onSubmit} disabled={!content.trim()} className="rounded-full bg-brand-grad px-5 text-white shadow-[0_10px_22px_rgba(255,143,199,0.28)] transition-transform hover:-translate-y-0.5">
              发布
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export function MiscellaneousEditDialog({
  open,
  onOpenChange,
  content,
  onContentChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md backdrop-blur-md bg-card/95 border border-white/60 rounded-[28px] shadow-[0_24px_70px_rgba(255,132,189,0.14)] dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/95">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle>编辑说说</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              placeholder="请输入说说内容..."
              className="resize-none min-h-[120px]"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={onSubmit} disabled={!content.trim()} className="rounded-full bg-brand-grad px-5 text-white shadow-[0_10px_22px_rgba(255,143,199,0.28)] transition-transform hover:-translate-y-0.5">
              保存
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export function MiscellaneousDeleteDialog({
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              此操作不可撤销，删除后说说将无法恢复。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              删除
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

