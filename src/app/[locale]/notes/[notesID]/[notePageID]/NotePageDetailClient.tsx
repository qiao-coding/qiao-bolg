'use client'
// 笔记阅读页客户端组件 - 基于官方 shadcn dashboard-01 block 布局
// SidebarProvider + AppSidebar（笔记目录树）+ SidebarInset（SiteHeader + 内容）
import type { CSSProperties } from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';
import NextRouter from '@/components/layout/NextRouter';
import { Note, NotesPage } from '@/types/note/type';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { NotePageContent } from '@/components/features/notes/notePageContent';
import { NoteToc } from '@/components/features/notes/NoteToc';
import type { TocItem } from '@/lib/docs/toc';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/shadcnComponents/sidebar';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { ArrowUpIcon, Calendar, Clock, Copy, ListTree, Loader2 } from 'lucide-react';

interface NotePageDetailClientProps {
  note: Note;
  notesPage: NotesPage;
  allNotes: Note[];
}

export default function NotePageDetailClient({
  note,
  notesPage,
  allNotes,
}: NotePageDetailClientProps) {
  const [isImageBackground, setIsImageBackground] = useState(false);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [copyDone, setCopyDone] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { theme } = useTheme();

  // 目录点击跳转 → 右侧笔记区显示 loading 对话框（目录侧不重渲染、不重放动画）
  const handleNavigate = useCallback(() => {
    setIsNavigating(true);
    // 兜底：最迟 1.5s 关闭，防止 loading 卡住
    if (navigateTimer.current) clearTimeout(navigateTimer.current);
    navigateTimer.current = setTimeout(() => setIsNavigating(false), 1500);
  }, []);

  // 新页面内容到达（uid 变化）即关闭 loading
  useEffect(() => {
    setIsNavigating(false);
  }, [notesPage?.uid]);

  const handleTocReady = useCallback((items: TocItem[]) => {
    setTocItems(items);
  }, []);

  // 复制 markdown 内容到剪贴板
  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(notesPage.content);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch (error) {
      console.error('复制内容失败:', error);
    }
  };

  return (
    <article
      className="min-h-screen"
      style={{
        backgroundImage: isImageBackground
          ? theme === 'dark'
            ? 'url(/note_img/page/notepage_dark.jpeg)'
            : 'url(/note_img/page/notepage_light.jpeg)'
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="blog-theme-bg relative font-sans transition-colors duration-300">
        <div className="blog-theme-decor pointer-events-none absolute inset-0" />
        {/* 路由组件 */}
        <NextRouter showHeader={false}>
          <SidebarProvider
            style={
              {
                '--sidebar-width': 'calc(var(--spacing) * 72)',
                '--header-height': 'calc(var(--spacing) * 12)',
              } as CSSProperties
            }
          >
            {/* 左侧笔记目录树 */}
            <AppSidebar
              variant="inset"
              notes={allNotes}
              activeNoteId={note?.id}
              activePageUid={notesPage?.uid}
              onNavigate={handleNavigate}
            />

            {/* 右侧内容区 */}
            <SidebarInset className="relative bg-transparent">
              <SiteHeader
                note={note}
                notesPage={notesPage}
                setIsImageBackground={setIsImageBackground}
              />

              {/* 点击目录跳转时右侧笔记区的 loading 对话框浮层 */}
              {isNavigating && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                  <div className="flex items-center gap-3 rounded-lg border border-brand-pink/20 bg-card/95 px-6 py-4 shadow-sm animate-fade-in dark:border-[#8fb7df]/24 dark:bg-[#202a3f]/95">
                    <Loader2 className="size-5 animate-spin text-brand-pink dark:text-[#b9d7f2]" />
                    <span className="text-sm text-muted-foreground">正在加载笔记…</span>
                  </div>
                </div>
              )}

              {/* 桌面端双栏布局：内容 + TOC（仅当 TOC 有内容时显示第二栏） */}
              <div className="container relative mx-auto px-4 py-8 sm:px-6 max-w-6xl">
                <div className={tocItems.length > 0
                  ? "grid gap-8 xl:grid-cols-[minmax(0,1fr)_200px] xl:gap-10 xl:items-start"
                  : ""
                }>
                  {/* 笔记页面主体 */}
                  <main
                    className="min-h-screen min-w-0 custom-scrollbar rounded-2xl border border-brand-pink/12 bg-[#fff8fc]/82 px-5 py-6 shadow-[0_18px_54px_rgba(255,132,189,0.08)] backdrop-blur-sm dark:border-[#8fb7df]/18 dark:bg-[#202a3f]/82 dark:shadow-[0_18px_54px_rgba(10,18,34,0.28)] sm:px-8"
                    key={notesPage.uid}
                  >
                    {/* 笔记页面标题 */}
                    <header className="mb-8 text-card-foreground">
                      <p className="mb-3 inline-flex items-center rounded-md border border-brand-pink/15 bg-brand-pink-soft/35 px-2.5 py-1 text-xs text-brand-pink-deep dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]">
                        Reading note
                      </p>
                      <h1 className="text-3xl sm:text-4xl font-semibold mb-6 leading-tight animate-fade-in
                                     text-foreground">
                        {notesPage.title}
                      </h1>

                      {/* 笔记页面时间信息 + 复制内容按钮 */}
                      <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm list-none">
                        <li className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="w-4 h-4" aria-hidden="true" />
                          <time dateTime={notesPage.dateStart}>发布于{notesPage.dateStart}</time>
                        </li>
                        <li className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-4 h-4" aria-hidden="true" />
                          <time dateTime={notesPage.dateEnd}>最后编辑：{notesPage.dateEnd}</time>
                        </li>
                        <li>
                          <Button
                            onClick={handleCopyContent}
                            variant="outline"
                            size="sm"
                            className="gap-1.5 rounded-md border-brand-pink/20 bg-white text-xs text-brand-pink-deep hover:bg-brand-pink-soft/35 dark:border-[#8fb7df]/24 dark:bg-[#26334d] dark:text-[#dbe9f8] dark:hover:bg-[#30405d]"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            {copyDone ? '已复制' : '复制内容'}
                          </Button>
                        </li>
                      </ul>
                    </header>

                    {/* 移动端 TOC 折叠按钮 */}
                    {tocItems.length > 0 && (
                      <details className="relative mb-6 mx-auto rounded-md border border-brand-pink/12 bg-white xl:hidden dark:border-[#8fb7df]/24 dark:bg-[#26334d]">
                        <summary className="flex items-center gap-2  px-4 py-2.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <ListTree className="size-4 shrink-0" />
                          本页目录
                        </summary>
                        <div className="px-4 pb-4">
                          <NoteToc items={tocItems} instanceId="toc-mobile" />
                        </div>
                      </details>
                    )}

                    {/* 笔记页面内容 */}
                    <NotePageContent content={notesPage.content} theme={theme as 'light' | 'dark'} onTocReady={handleTocReady} />

                    {/* 笔记页面标签 */}
                    <section aria-labelledby="note-tags" className="mt-8 border-t border-brand-pink-border/45 pt-6 transition-all duration-300 dark:border-[#8fb7df]/18">
                      <div className="flex flex-wrap items-center gap-3">
                        <span id="note-tags" className="text-sm text-muted-foreground">标签：</span>
                        {notesPage.pageTags && notesPage.pageTags.map((tag, index) => (
                          <span
                            key={`tag-${tag}-${index}`}
                            className="inline-flex items-center text-sm px-3 py-1.5
                                     rounded-full transition-all duration-300
                                     bg-brand-pink-soft/35 text-brand-pink-deep border border-brand-pink/15 dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </section>
                  </main>

                  {/* 桌面端右侧 TOC */}
                  {tocItems.length > 0 && (
                    <aside className="hidden xl:block xl:sticky mx-auto xl:top-24 xl:w-full xl:shrink-0">
                      <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain pr-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as CSSProperties}>
                        <NoteToc items={tocItems} instanceId="toc-desktop" />
                      </div>
                    </aside>
                  )}
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </NextRouter>

        {/* 返回顶部按钮（右侧，避免被左侧固定侧边栏遮挡） */}
        <footer
          className="fixed bottom-[3%] right-[3%] z-20"
        >
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            variant="outline"
            aria-label="返回顶部"
            className="border-border bg-card/90 text-foreground hover:bg-accent"
          >
            {/* 返回顶部按钮文本 */}
            <span className="hidden md:inline-block">返回顶部</span>
            {/* 返回顶部按钮图标 */}
            <ArrowUpIcon />
          </Button>
        </footer>
      </div>
    </article>
  );
}
