'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/shadcnComponents/dialog';
import { Button } from '@/components/ui/shadcnComponents/button';
import { Input } from '@/components/ui/shadcnComponents/input';
import { Label } from '@/components/ui/shadcnComponents/label';
import { Note } from '@/types/note/type';



export const NoteEditDialog= ({
  note,
  isOpen,
  onOpenChange,
  onUpdateNote,
  isLoading,
  onNoteChange
}: {
  note: Note;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateNote: (id: number) => void;
  isLoading: boolean;
  onNoteChange: (note: Note) => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onUpdateNote(note.id);
          }}
        >
          <DialogHeader>
            <DialogTitle>编辑笔记分类</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-3">
            <div className="grid gap-3">
              <Label htmlFor="edit-note-title">标题</Label>
              <Input
                id="edit-note-title"
                name="editTitle"
                defaultValue={note.title}
                onChange={(e) => onNoteChange({ ...note, title: e.target.value })}
                placeholder="请输入分类标题"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '保存中' : '保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};