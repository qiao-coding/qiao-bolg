"use client"

// 笔记阅读页侧边栏：基于官方 shadcn dashboard-01 AppSidebar 改造
// - 分类（folder）点击展开/折叠，默认展开当前分类
// - 页面（leaf）点击跳转到对应笔记内容页
// - gsap 入场 stagger 动画
import * as React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
} from "@/components/ui/shadcnComponents/sidebar"
import { useRouter } from "@/i18n/navigation"
import type { Note } from "@/types/note/type"
import { cn } from "@/lib/utils"

// 模块级时间戳：区分 StrictMode 双挂载（<300ms，重播保证入场动画可见）
// 与导航后的重挂载（>300ms，跳过动画直接置为最终态，避免重复播放）
let lastEntranceAt = 0
// 模块级：目录滚动位置跨重挂载保留（导航跳转后恢复，避免滚动被重置）
let savedSidebarScroll = 0

const CATEGORY_ROW_HEIGHT = 36
const PAGE_ROW_HEIGHT = 30
const TREE_OVERSCAN = 300

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  notes: Note[]
  activeNoteId: number
  activePageUid?: string
  onNavigate?: () => void
}

type NotePageItem = NonNullable<Note["page"]>[number]

type SidebarTreeRow =
  | {
      kind: "note"
      note: Note
      expanded: boolean
      top: number
      height: number
    }
  | {
      kind: "page"
      noteId: number
      page: NotePageItem
      top: number
      height: number
    }

export function AppSidebar({
  notes,
  activeNoteId,
  activePageUid,
  onNavigate,
  ...props
}: AppSidebarProps) {
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollRafRef = useRef<number | null>(null)
  const [scrollTop, setScrollTop] = useState(savedSidebarScroll)
  const [viewportHeight, setViewportHeight] = useState(720)
  const [mutatingId, setMutatingId] = useState<number | null>(null)
  // 防抖：记录上次跳转目标，300ms 内重复点击同一项直接忽略（避免连点触发多次跳转）
  const lastJumpRef = useRef<{ key: string; at: number } | null>(null)
  // 本地高亮：点击时乐观更新（立即高亮），服务器返回后同步
  const [activePage, setActivePage] = useState(activePageUid)
  useEffect(() => {
    setActivePage(activePageUid)
  }, [activePageUid])

  // 默认展开当前笔记分类
  const [expandedIds, setExpandedIds] = useState<Set<number>>(
    () => new Set([activeNoteId])
  )

  useEffect(() => {
    setExpandedIds((prev) => {
      if (prev.has(activeNoteId)) return prev
      const next = new Set(prev)
      next.add(activeNoteId)
      return next
    })
  }, [activeNoteId])

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

  const treeRows = useMemo(() => {
    const rows: SidebarTreeRow[] = []
    let top = 0

    sortedNotes.forEach((note) => {
      const expanded = expandedIds.has(note.id)
      rows.push({ kind: "note", note, expanded, top, height: CATEGORY_ROW_HEIGHT })
      top += CATEGORY_ROW_HEIGHT

      if (expanded) {
        ;(note.page || []).forEach((page) => {
          rows.push({ kind: "page", noteId: note.id, page, top, height: PAGE_ROW_HEIGHT })
          top += PAGE_ROW_HEIGHT
        })
      }
    })

    return { rows, height: top }
  }, [expandedIds, sortedNotes])

  const visibleRows = useMemo(() => {
    const min = Math.max(0, scrollTop - TREE_OVERSCAN)
    const max = scrollTop + viewportHeight + TREE_OVERSCAN
    return treeRows.rows.filter((row) => row.top + row.height >= min && row.top <= max)
  }, [scrollTop, treeRows.rows, viewportHeight])

  // 展开/折叠：先把所有行设为不可见，再做布局重排，最后按需逐个淡入。
  // 避免折叠时全部行 top 重排的中间态闪烁；展开后新行随 stagger 逐个显示。
  const toggle = useCallback((id: number) => {
    const menuEl = menuRef.current
    const rows = () =>
      menuEl ? Array.from(menuEl.querySelectorAll<HTMLElement>("[data-sidebar-row]")) : []
    setMutatingId(id)
    // 1) 先让当前渲染的所有行不可见
    if (rows().length) gsap.set(rows(), { opacity: 0, overwrite: "auto" })
    requestAnimationFrame(() => {
      // 2) 这一帧完成布局重排（expandedIds 变化 → 行 top 全部重算）
      setExpandedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
      requestAnimationFrame(() => {
        // 3) 布局到位后逐个淡入（新展开的分类/页面行在可视区内先出现）
        const els = rows()
        if (els.length) {
          gsap.to(els, {
            opacity: 1,
            stagger: 0.012,
            duration: 0.16,
            ease: "power2.out",
            overwrite: "auto",
            clearProps: "opacity",
          })
        }
        setMutatingId(null)
      })
    })
  }, [])

  const handleSidebarScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    savedSidebarScroll = el.scrollTop
    if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current)
    scrollRafRef.current = requestAnimationFrame(() => {
      setScrollTop(el.scrollTop)
    })
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const updateViewportHeight = () => setViewportHeight(el.clientHeight)
    updateViewportHeight()

    if (savedSidebarScroll > 0) {
      el.scrollTop = savedSidebarScroll
      setScrollTop(savedSidebarScroll)
    }

    const resizeObserver = new ResizeObserver(updateViewportHeight)
    resizeObserver.observe(el)

    return () => {
      resizeObserver.disconnect()
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current)
    }
  }, [])

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
        onScroll={handleSidebarScroll}
        className="[scrollbar-width:thin] [scrollbar-color:color-mix(in_oklab,var(--color-brand-pink)_45%,transparent)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-brand-pink/35 hover:[&::-webkit-scrollbar-thumb]:bg-brand-pink/55 dark:[&::-webkit-scrollbar-thumb]:bg-[#8fb7df]/50">
        <SidebarGroup>
          <SidebarGroupLabel>分类 · 页面</SidebarGroupLabel>
          <div ref={menuRef}>
            <SidebarMenu
              aria-busy={mutatingId !== null}
              className="relative gap-0"
              style={{ height: treeRows.height }}
            >
              {visibleRows.map((row) => {
                if (row.kind === "note") {
                  const { note, expanded } = row
                  const isActiveNote = note.id === activeNoteId
                  return (
                    <SidebarMenuItem
                      key={`note-${note.id}`}
                      data-sidebar-row
                      className="absolute left-0 right-0"
                      style={{
                        top: row.top,
                        height: row.height,
                        contentVisibility: "auto",
                        containIntrinsicSize: `${CATEGORY_ROW_HEIGHT}px`,
                      } as React.CSSProperties}
                    >
                      <SidebarMenuButton
                        className="sidebar-cat-row cursor-pointer"
                        isActive={isActiveNote}
                        tooltip={note.title}
                        onClick={() => toggle(note.id)}
                        aria-expanded={expanded}
                      >
                        <ChevronRight
                          className={cn(
                            "shrink-0 text-muted-foreground transition-transform duration-200",
                            expanded && "rotate-90"
                          )}
                        />
                        {expanded ? (
                          <FolderOpen className="shrink-0 text-brand-pink dark:text-[#b9d7f2]" />
                        ) : (
                          <Folder className="shrink-0 text-brand-pink dark:text-[#b9d7f2]" />
                        )}
                        <span className="flex-1 truncate">{note.title}</span>
                        <SidebarMenuBadge>{note.page?.length || 0}</SidebarMenuBadge>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                const active = row.page.uid === activePage
                return (
                  <li
                    key={`page-${row.noteId}-${row.page.uid || row.page.id}`}
                    data-sidebar-row
                    className="absolute left-0 right-0"
                    style={{
                      top: row.top,
                      height: row.height,
                      contentVisibility: "auto",
                      containIntrinsicSize: `${PAGE_ROW_HEIGHT}px`,
                    } as React.CSSProperties}
                  >
                    <button
                      type="button"
                      onClick={() => goPage(row.noteId, row.page.uid)}
                      className={cn(
                        "ml-7 flex h-7 w-[calc(100%-1.75rem)] min-w-0 -translate-x-px cursor-pointer items-center gap-2 overflow-hidden rounded-md px-2 text-left text-sm text-sidebar-foreground outline-hidden ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2",
                        active && "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      )}
                    >
                      <FileText className="size-4 shrink-0 text-sidebar-accent-foreground" />
                      <span className="truncate">{row.page.title}</span>
                    </button>
                  </li>
                )
              })}
            </SidebarMenu>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
