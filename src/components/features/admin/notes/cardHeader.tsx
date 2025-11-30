'use client';

import { Plus } from 'lucide-react';
import {
  CardHeader,
  CardTitle
} from '@/components/ui/shadcnComponents/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/shadcnComponents/dialog';
import { Button } from '@/components/ui/shadcnComponents/button';
import { Input } from '@/components/ui/shadcnComponents/input';
import { Label } from '@/components/ui/shadcnComponents/label';


export const NoteCardHeader= ({
  setAddNotesPage,
  isAddDialogOpen,
  setIsAddDialogOpen,
  submitAddNote
}: {
  setAddNotesPage: (value: string) => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  submitAddNote: (e: React.FormEvent) => void;

}
) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div>
        <CardTitle>笔记分类</CardTitle>
      </div>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="gap-1 cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>新建分类</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={submitAddNote}>
            <DialogHeader>
              <DialogTitle>新建笔记分类</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-3">
              <div className="grid gap-3">
                <Label htmlFor="name-1">标题</Label>
                <Input
                  id="name-1"
                  name="name"
                  onChange={(e) => setAddNotesPage(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">添加</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </CardHeader>
  );
};