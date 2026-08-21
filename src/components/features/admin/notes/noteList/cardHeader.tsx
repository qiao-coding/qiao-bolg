'use client';

import { Plus } from 'lucide-react';
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/shadcnComponents/data-display/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/shadcnComponents/overlay/dialog';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { Input } from '@/components/ui/shadcnComponents/forms/input';
import { Label } from '@/components/ui/shadcnComponents/forms/label';
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
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
      <div>
        <CardTitle className="text-xl font-bold text-brand-grad">{title}</CardTitle>
        <CardDescription className="text-muted-foreground/80">{description}</CardDescription>
      </div>
      <Dialog open={isAddNotesDialogOpen} onOpenChange={setIsAddNotesDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="h-10 gap-1 cursor-pointer rounded-full bg-brand-grad px-4 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(255,143,199,0.28)] transition-transform hover:-translate-y-0.5">
            <Plus className="h-4 w-4" />
            <span>新建笔记</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]
         backdrop-blur-md bg-card/95
         border border-white/60 rounded-[28px] shadow-[0_24px_70px_rgba(255,132,189,0.14)] dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/95">
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
              <Button type="submit" className="rounded-full bg-brand-grad px-5 text-white shadow-[0_10px_22px_rgba(255,143,199,0.28)] transition-transform hover:-translate-y-0.5">添加</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </CardHeader>
  );
}