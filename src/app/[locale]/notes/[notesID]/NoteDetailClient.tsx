"use client";
// 笔记详情页面客户端组件 - 展示笔记标题和页面导航
import NextRouter from "@/components/layout/NextRouter";
import { Link, useRouter } from "@/i18n/navigation";
import PageNavigation from "@/components/features/notes/PageNavigation";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import { Note, NotesPage } from "@/types/note/type";
import { NoteListCard } from "@/components/features/notes/noteListCard";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { ArrowLeft, ArrowUpIcon, List } from "lucide-react";
import { motion } from "framer-motion";
import ThemePage from "@/components/ui/public/themePage";

interface NoteDetailClientProps {
  note: Note;
  notesID: string;
}

export default function NoteDetailClient({ note, notesID }: NoteDetailClientProps) {
  const router = useRouter();

  const handleUid = (notePageID: string) => {
    router.push(`/notes/${notesID}/${notePageID}`);
  };

  return (
    <TechBackgroundNoGrid>
      <NextRouter showHeader={false}>
        {/* Header */}
        <header className="sticky top-0 z-30
                           bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm
                           border-b border-border/30">
          <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <Link
              href="/notes"
              className="flex items-center gap-1.5 text-sm text-muted-foreground
                         hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回列表</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href={`/notes/${notesID}/contents`}
                className="flex items-center gap-1.5 text-sm text-muted-foreground
                           hover:text-primary transition-colors"
              >
                <List className="w-4 h-4" />
                目录
              </Link>
              <ThemePage />
            </div>
          </div>
        </header>

        <motion.main
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-[720px] mx-auto pt-28 pb-24 px-6"
        >
          {/* 标题 */}
          <header className="mb-10">
            <Title>{note?.title}</Title>
          </header>

          {/* 页面列表 */}
          {note && (
            <NoteListCard note={note} handleUid={handleUid} />
          )}
        </motion.main>
      </NextRouter>

      {/* 桌面端右侧页面导航 */}
      {note?.page && note.page.length > 0 && (
        <nav
          className="hidden lg:flex flex-col fixed right-[5%] top-[20%] z-40"
          aria-label="笔记目录导航"
        >
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm
                          rounded-xl border border-border/40 shadow-sm p-4">
            <p className="text-sm font-semibold text-foreground mb-3">
              笔记目录
            </p>
            <PageNavigation
              notesPage={note.page as NotesPage[]}
              pageStyle="text-muted-foreground text-sm"
              activeStyle="text-primary font-semibold"
            />
          </div>
        </nav>
      )}

      {/* 返回顶部 */}
      <footer className="fixed bottom-[3%] left-[3%]">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          variant="outline"
          aria-label="返回顶部"
          className="bg-card/60 text-foreground"
        >
          <span className="hidden md:inline-block">返回顶部</span>
          <ArrowUpIcon />
        </Button>
      </footer>
    </TechBackgroundNoGrid>
  );
}
