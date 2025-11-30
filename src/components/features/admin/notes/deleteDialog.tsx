'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/shadcnComponents/dialog';
import { Button } from '@/components/ui/shadcnComponents/button';


export const NoteDeleteDialog= ({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  noteToDelete,
  handleDeleteNote
}:
  {
    isDeleteDialogOpen: boolean;
    setIsDeleteDialogOpen: (open: boolean) => void;
    noteToDelete: number | null;
    handleDeleteNote: (id: number) => void;
  }
) => {
  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            此操作不可撤销，删除后笔记及其所有页面将无法恢复。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteNote(noteToDelete as number)}
          >
            删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};