'use client'
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ImageIcon, Palette } from 'lucide-react';
import ThemePage from '@/components/ui/public/themePage';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/shadcnComponents/overlay/dropdown-menu';
import { Button } from '@/components/ui/shadcnComponents/forms/button';



export function NotePageHeader({ setIsImageBackground }: { setIsImageBackground: (isImageBackground: boolean) => void }) {
  return (
    <header className="sticky top-0 z-30 border-b shadow-sm
     backdrop-blur-sm transition-all duration-300 
     bg-sky-50 dark:bg-slate-700/80 border-border">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/notes"
          className="flex items-center transition-colors text-sky-600/80 dark:text-sky-200/80 hover:text-sky-500 dark:hover:text-sky-200"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          <span>返回列表</span>
        </Link>

        <div className="flex items-center gap-4 text-sky-700 dark:text-sky-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="px-2 text-sky-700 dark:text-sky-200 hover:bg-sky-100/70 dark:hover:bg-slate-700/50">
              切换背景
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className='bg-sky-50 dark:bg-slate-700/80 '>
            <DropdownMenuItem onClick={() => setIsImageBackground(false)}>
              <Palette className="mr-2 w-4 h-4" />
              纯色背景
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsImageBackground(true)}>
              <ImageIcon className="mr-2 w-4 h-4" />
              图片背景
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
          <ThemePage />
        </div>
      </div>
    </header>
  );
}

