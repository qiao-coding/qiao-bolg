"use client"

// 笔记阅读页头部：基于官方 shadcn dashboard-01 SiteHeader 改造
// - 左侧：SidebarTrigger + 面包屑（笔记 → 分类 → 页面）
// - 右侧：切换背景 + 主题切换
import * as React from "react"
import { ImageIcon, LogOut, Palette } from "lucide-react"
import { Button } from "@/components/ui/shadcnComponents/button"
import { Separator } from "@/components/ui/shadcnComponents/separator"
import { SidebarTrigger } from "@/components/ui/shadcnComponents/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/shadcnComponents/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcnComponents/dropdown-menu"
import { Link } from "@/i18n/navigation"
import ThemePage from "@/components/ui/public/themePage"
import type { Note, NotesPage } from "@/types/note/type"

interface SiteHeaderProps {
  note?: Note | null
  notesPage?: NotesPage | null
  setIsImageBackground: (isImageBackground: boolean) => void
}

export function SiteHeader({
  note,
  notesPage,
  setIsImageBackground,
}: SiteHeaderProps) {
  return (
    <header data-note-site-header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb className="hidden min-w-0 lg:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/notes" className="flex items-center gap-1 text-brand-blue hover:text-brand-pink dark:text-sky-200 dark:hover:text-pink-300">
                  笔记
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/notes/${note?.id}`} className="text-brand-blue hover:text-brand-pink dark:text-sky-200 dark:hover:text-pink-300">
                  {note?.title}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-40 truncate">{notesPage?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="px-2 text-foreground hover:bg-brand-pink/10 hover:text-brand-pink-deep dark:hover:bg-slate-700/50"
          >
            <Link href={note?.id ? `/notes/${note.id}` : "/notes"}>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">退出阅读</span>
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="px-2 text-foreground hover:bg-brand-blue/10 dark:hover:bg-slate-700/50"
              >
                <Palette className="size-4" />
                <span className="hidden sm:inline">切换背景</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
              <DropdownMenuItem onClick={() => setIsImageBackground(false)}>
                <Palette className="mr-2 size-4" />
                纯色背景
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsImageBackground(true)}>
                <ImageIcon className="mr-2 size-4" />
                图片背景
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemePage />
        </div>
      </div>
    </header>
  )
}
