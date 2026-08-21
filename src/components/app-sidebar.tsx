"use client"

// 笔记阅读页侧边栏：基于官方 shadcn dashboard-01 AppSidebar 改造
// - 分类（folder）点击展开/折叠，默认展开当前分类
// - 页面（leaf）点击跳转到对应笔记内容页
// - gsap 入场 stagger 动画
import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { BookMarked, ChevronRight, FileText, Folder, FolderOpen } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/shadcnComponents/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/shadcnComponents/navigation/collapsible"
import { usePathname, useRouter } from "@/i18n/navigation"
import type { Note } from "@/types/note/type"

// 模块级时间戳：区分 StrictMode 双挂载（<300ms，重播保证入场动画可见）
// 与导航后的重挂载（>300ms，跳过动画直接置为最终态，避免重复播放）
let lastEntranceAt = 0
// 模块级：目录滚动位置跨重挂载保留（导航跳转后恢复，避免滚动被重置）
let savedSidebarScroll = 0

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  notes: Note[]
  activeNoteId: number
  activePageUid?: string
  onNavigate?: () => void
}

export function AppSidebar({
  notes,
  activeNoteId,
  activePageUid,
  onNavigate,
  ...props
}: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pendingRefreshPath = useRef<string | null>(null)
  // 防抖：记录上次跳转目标，300ms 内重复点击同一项直接忽略（避免连点触发多次跳转）
  const lastJumpRef = useRef<{ key: string; at: number } | null>(null)
  // 本地高亮：点击时乐观更新（立即高亮），服务器返回后同步
  const [activePage, setActivePage] = useState(activePageUid)
  useEffect(() => {
    setActivePage(activePageUid)
  }, [activePageUid])

  useEffect(() => {
    if (
      pendingRefreshPath.current &&
      (pathname === pendingRefreshPath.current || pathname.endsWith(pendingRefreshPath.current))
    ) {
      pendingRefreshPath.current = null
      router.refresh()
    }
  }, [pathname, router])
  // 默认展开当前笔记分类
  const [expandedIds, setExpandedIds] = useState<Set<number>>(
    () => new Set([activeNoteId])
  )

  // 分类下页面按 dateEnd 倒序（与管理面板一致）
  const sortedNotes = useMemo(
    () =>
      notes.map((n) => ({
        ...n,
        page: [...(n.page || [])].sort((a, b) => {
          const aDate = new Date(a.dateEnd || "")
          const bDate = new Date(b.dateEnd || "")
          return bDate.getTime() - aDate.getTime()
        }),
      })),
    [notes]
  )

  const toggle = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const goPage = (noteId: number, uid?: string) => {
    // uid 缺失时兜底到该分类最新一篇，保证点击必进阅读页
    const target = uid ?? sortedNotes.find((n) => n.id === noteId)?.page?.[0]?.uid
    if (!target) return
    // 点击当前正在显示的页面：直接忽略（避免触发 loading 闪烁 + push 同 URL 无效果，表现为"卡住"）
    if (target === activePageUid) return
    // 防抖：300ms 内重复点击同一目标直接忽略，避免连点触发多次跳转
    const key = `${noteId}:${target}`
    const now = Date.now()
    if (
      lastJumpRef.current &&
      lastJumpRef.current.key === key &&
      now - lastJumpRef.current.at < 300
    ) {
      return
    }
    lastJumpRef.current = { key, at: now }
    // 通知父级显示 loading（只盖右侧笔记区，目录不重渲染）
    onNavigate?.()
    // 乐观更新：点击立即高亮，不等服务器返回
    setActivePage(target)
    const targetPath = `/notes/${noteId}/${target}`
    pendingRefreshPath.current = targetPath
    router.push(targetPath)
  }

  // 分类行入场 stagger（时间戳锁：StrictMode 双挂载重播保证首次可见；导航重挂载不再播放）
  useGSAP(
    () => {
      // 恢复上次的目录滚动位置（导航重挂载后保留，避免滚动被重置）
      if (scrollRef.current && savedSidebarScroll > 0) {
        scrollRef.current.scrollTop = savedSidebarScroll
      }
      const now = Date.now()
      if (lastEntranceAt !== 0 && now - lastEntranceAt < 300) {
        // StrictMode 双挂载：重播，保证首次入场动画可见
        lastEntranceAt = now
        gsap.fromTo(
          ".sidebar-cat-row",
          { opacity: 0, x: -10 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.02,
            duration: 0.25,
            ease: "power2.out",
            overwrite: true,
            clearProps: "opacity,transform",
          }
        )
        return
      }
      if (lastEntranceAt !== 0) {
        // 导航后的重挂载：跳过入场动画，直接置为最终可见态
        gsap.set(".sidebar-cat-row", { opacity: 1, x: 0 })
        return
      }
      lastEntranceAt = now
      gsap.fromTo(
        ".sidebar-cat-row",
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.02,
          duration: 0.25,
          ease: "power2.out",
          overwrite: true,
          clearProps: "opacity,transform",
        }
      )
    },
    { scope: menuRef }
  )

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-brand-pink/12 bg-[#fff2f8] [&_[data-slot=sidebar-inner]]:bg-transparent dark:border-[#8fb7df]/24 dark:bg-[#202a3f] dark:[&_[data-slot=sidebar-inner]]:bg-transparent"
      {...props}
    >
      <SidebarHeader className="border-b border-brand-pink/12 bg-white/45 dark:border-[#8fb7df]/24 dark:bg-[#26334d]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
              <BookMarked className="size-5! shrink-0 text-brand-pink dark:text-[#b9d7f2]" />
              <span className="text-base font-semibold text-foreground">
                笔记导航
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent
        ref={scrollRef}
        onScroll={() => {
          if (scrollRef.current) savedSidebarScroll = scrollRef.current.scrollTop
        }}
        className="[scrollbar-width:thin] [scrollbar-color:color-mix(in_oklab,var(--color-brand-pink)_45%,transparent)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-brand-pink/35 hover:[&::-webkit-scrollbar-thumb]:bg-brand-pink/55 dark:[&::-webkit-scrollbar-thumb]:bg-[#8fb7df]/50">
        <SidebarGroup>
          <SidebarGroupLabel>分类 · 页面</SidebarGroupLabel>
          <div ref={menuRef}>
            <SidebarMenu>
              {sortedNotes.map((note) => {
                const expanded = expandedIds.has(note.id)
                const isActiveNote = note.id === activeNoteId
                return (
                  <Collapsible
                    key={note.id}
                    open={expanded}
                    onOpenChange={() => toggle(note.id)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className="sidebar-cat-row cursor-pointer"
                          isActive={isActiveNote}
                          tooltip={note.title}
                        >
                          <ChevronRight className="shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          {expanded ? (
                            <FolderOpen className="shrink-0 text-brand-pink dark:text-[#b9d7f2]" />
                          ) : (
                            <Folder className="shrink-0 text-brand-pink dark:text-[#b9d7f2]" />
                          )}
                          <span className="flex-1 truncate">{note.title}</span>
                          <SidebarMenuBadge>{note.page?.length || 0}</SidebarMenuBadge>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {(note.page || []).map((p) => (
                            <SidebarMenuSubItem key={p.uid || p.id}>
                              <SidebarMenuSubButton
                                isActive={p.uid === activePage}
                                onClick={() => goPage(note.id, p.uid)}
                                className="cursor-pointer"
                              >
                                <FileText />
                                <span>{p.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
