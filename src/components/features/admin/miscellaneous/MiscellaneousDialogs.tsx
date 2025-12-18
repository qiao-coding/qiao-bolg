'use client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/shadcnComponents/dialog';
import { Button } from '@/components/ui/shadcnComponents/button';
import { Textarea } from '@/components/ui/shadcnComponents/textarea';
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
      <DialogContent className="sm:max-w-md">
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
            <Button onClick={onSubmit} disabled={!content.trim()}>
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
      <DialogContent className="sm:max-w-md">
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
            <Button onClick={onSubmit} disabled={!content.trim()}>
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
      <DialogContent>
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

