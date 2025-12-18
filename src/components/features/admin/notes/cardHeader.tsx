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
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
      <div>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          笔记分类
        </CardTitle>
      </div>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            className="gap-1 cursor-pointer bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-4 w-4" />
            <span>新建分类</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] backdrop-blur-sm bg-card/90 dark:bg-card/90 border border-border/40 shadow-2xl">
          <form onSubmit={submitAddNote}>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">新建笔记分类</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1" className="font-medium">标题</Label>
                <Input
                  id="name-1"
                  name="name"
                  onChange={(e) => setAddNotesPage(e.target.value)}
                  className="border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
              >
                添加
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </CardHeader>
  );
};