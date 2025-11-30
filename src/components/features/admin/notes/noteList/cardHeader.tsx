'use client';

import { Plus } from 'lucide-react';
import {
  CardHeader,
  CardTitle,
  CardDescription,
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
import { AntTabs } from '@/components/ui/ant/ant_taps';

interface NoteListCardHeaderProps {
  title: string;
  description: string;
  isAddNotesDialogOpen: boolean;
  setIsAddNotesDialogOpen: (open: boolean) => void;
  addNotesPageTitle: string;
  setAddNotesPageTitle: (title: string) => void;
  defaultTags: string[];
  onTagsChange: (tags: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function NoteListCardHeader({
  title,
  description,
  isAddNotesDialogOpen,
  setIsAddNotesDialogOpen,
  addNotesPageTitle,
  setAddNotesPageTitle,
  defaultTags,
  onTagsChange,
  onSubmit,
}: NoteListCardHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <Dialog open={isAddNotesDialogOpen} onOpenChange={setIsAddNotesDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="gap-1 cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>新建笔记</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>新建笔记</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 my-6">
              <div className="grid gap-3">
                <Label htmlFor="name-1">标题</Label>
                <Input 
                  id="name-1" 
                  name="name" 
                  value={addNotesPageTitle}
                  onChange={(e) => setAddNotesPageTitle(e.target.value)} 
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">标签</Label>
                <AntTabs
                  defaultTags={defaultTags}
                  onTagsChange={onTagsChange} 
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
}