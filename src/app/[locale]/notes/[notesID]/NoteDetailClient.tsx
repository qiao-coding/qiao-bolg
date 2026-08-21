"use client";
// 笔记详情页面客户端组件 - 展示笔记标题和页面导航
import NextRouter from "@/components/layout/NextRouter";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import { Note } from "@/types/note/type";
import { NoteListCard } from "@/components/features/notes/noteListCard";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { ArrowLeft, ArrowUpIcon, List } from "lucide-react";
import ThemePage from "@/components/ui/public/themePage";
import { useEffect, useRef } from "react";

interface NoteDetailClientProps {
  note: Note;
  notesID: string;
}

export default function NoteDetailClient({ note, notesID }: NoteDetailClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const pendingRefreshPath = useRef<string | null>(null);

  useEffect(() => {
    if (
      pendingRefreshPath.current &&
      (pathname === pendingRefreshPath.current || pathname.endsWith(pendingRefreshPath.current))
    ) {
      pendingRefreshPath.current = null;
      router.refresh();
    }
  }, [pathname, router]);

  // 处理点击笔记页面跳转
  const handleUid = (notePageID: string) => {
    const targetPath = `/notes/${notesID}/${notePageID}`;
    pendingRefreshPath.current = targetPath;
    router.push(targetPath);
  };

  return (
    <TechBackgroundNoGrid>
      <NextRouter showHeader={false} >
        <header className="container mx-auto flex justify-between px-4 py-5 sm:px-6">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/76 px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm transition-colors hover:text-brand-pink-deep dark:border-[#8fb7df]/24 dark:bg-[#26334d] dark:text-[#dbe9f8]"
          >
            <ArrowLeft className="size-4" />
            <span>返回列表</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/notes/${notesID}/contents`}
              className="inline-flex items-center gap-2 rounded-full border border-brand-pink/25 bg-brand-pink-soft/80 px-4 py-2 text-sm font-semibold text-brand-pink-deep transition-colors hover:bg-white/80 dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8] dark:hover:bg-[#30405d]"
            >
              <List className="size-4" />
              目录
            </Link>
            <ThemePage />
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <header className="mb-10 border-b border-brand-pink/15 pb-8 text-center">
            <div>
              <Title>{note && note.title}</Title>
              <p className="mt-4 text-sm text-muted-foreground">{note.page?.length ?? 0} 篇笔记</p>
            </div>
          </header>

          <section className="min-h-screen">
            {note && <NoteListCard
              note={note}
              handleUid={handleUid}
            />}
          </section>
        </main>
      </NextRouter>

      <footer
        className="fixed bottom-[3%] left-[3%] "
      >
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          variant="outline"
          aria-label="返回顶部"
          className="border-border bg-card/90 text-foreground hover:bg-accent"
        >
          <span className="hidden md:inline-block">返回顶部</span>
          <ArrowUpIcon />
        </Button>
      </footer>
    </TechBackgroundNoGrid>
  );
}
