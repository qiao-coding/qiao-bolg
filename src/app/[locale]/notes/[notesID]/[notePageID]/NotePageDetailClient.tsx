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
      <div className="font-sans transition-colors duration-300
       bg-sky-50/90 dark:bg-slate-800/90"
      >
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
            <SidebarInset className="relative bg-sky-50/90 dark:bg-slate-800/90">
              <SiteHeader
                note={note}
                notesPage={notesPage}
                setIsImageBackground={setIsImageBackground}
              />

              {/* 点击目录跳转时右侧笔记区的 loading 对话框浮层 */}
              {isNavigating && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-sky-50/70 backdrop-blur-sm dark:bg-slate-800/60">
                  <div className="flex items-center gap-3 rounded-xl border border-sky-200/70 bg-white/90 px-6 py-4 shadow-xl animate-fade-in dark:border-sky-500/30 dark:bg-slate-700/90">
                    <Loader2 className="size-5 animate-spin text-sky-500 dark:text-sky-300" />
                    <span className="text-sm text-sky-700 dark:text-sky-200">正在加载笔记…</span>
                  </div>
                </div>
              )}

              {/* 桌面端双栏布局：内容 + TOC（仅当 TOC 有内容时显示第二栏） */}
              <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
                <div className={tocItems.length > 0
                  ? "grid gap-8 xl:grid-cols-[minmax(0,1fr)_200px] xl:gap-10 xl:items-start"
                  : ""
                }>
                  {/* 笔记页面主体 */}
                  <main
                    className="min-h-screen min-w-0 custom-scrollbar"
                    key={notesPage.uid}
                  >
                    {/* 笔记页面标题 */}
                    <header className="mb-8 text-card-foreground">
                      <h1 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight animate-fade-in
                                     text-sky-600 dark:text-sky-300">
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
                            className="gap-1.5 text-xs border-sky-200/70 bg-sky-50/60 text-sky-700 hover:bg-sky-100 dark:bg-slate-700/50 dark:text-sky-200 dark:border-sky-500/30"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            {copyDone ? '已复制' : '复制内容'}
                          </Button>
                        </li>
                      </ul>
                    </header>

                    {/* 移动端 TOC 折叠按钮 */}
                    {tocItems.length > 0 && (
                      <details className="relative mb-6 mx-auto xl:hidden rounded-lg border border-sky-200/60 bg-sky-50/60 dark:border-sky-500/20 dark:bg-slate-700/40">
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
                    <section aria-labelledby="note-tags" className="mt-8 pt-6 border-t transition-all duration-300 border-border">
                      <div className="flex flex-wrap items-center gap-3">
                        <span id="note-tags" className="text-sm text-muted-foreground">标签：</span>
                        {notesPage.pageTags && notesPage.pageTags.map((tag, index) => (
                          <span
                            key={`tag-${tag}-${index}`}
                            className="inline-flex items-center text-sm px-3 py-1.5
                                     rounded-full transition-all duration-300
                                     bg-sky-50 text-sky-700 border-[1.5px] border-sky-200/70
                                     dark:bg-slate-700/60 dark:text-sky-200 dark:border-sky-500/30
                                     hover:bg-sky-100 hover:shadow-md dark:hover:bg-slate-700"
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
            className="bg-sky-100/80 text-sky-700 hover:bg-sky-200/70 dark:bg-slate-700/60 dark:text-sky-200"
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
