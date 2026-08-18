"use client";
// 笔记详情页面客户端组件 - 展示笔记标题和页面导航
import NextRouter from "@/components/layout/NextRouter";
import { Link, useRouter } from "@/i18n/navigation";
import { NoteDirectory } from "@/components/features/notes/NoteDirectory";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import { Note } from "@/types/note/type";
import { NoteListCard } from "@/components/features/notes/noteListCard";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { ArrowUpIcon } from "lucide-react";
import { motion } from "framer-motion";
import ThemePage from "@/components/ui/public/themePage";

interface NoteDetailClientProps {
  note: Note;
  notesID: string;
  allNotes: Note[];
}

export default function NoteDetailClient({ note, notesID, allNotes }: NoteDetailClientProps) {
  const router = useRouter();

  // 处理点击笔记页面跳转
  const handleUid = (notePageID: string) => {
    router.push(`/notes/${notesID}/${notePageID}`);
  };

  return (
    <TechBackgroundNoGrid>
      <NextRouter showHeader={false} >
        <header className="flex justify-between mb-5 container mx-auto px-4 sm:px-6 py-4 flex">
          <Link
            href="/notes"
            className="flex items-center
             text-[#8A94A6] dark:text-white/65
             hover:text-[#4A6FA5] transition-colors cursor-target"
          >
            <svg
              className="mr-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>返回列表</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/notes/${notesID}/contents`}
              className="flex items-center text-sm
               text-[#8A94A6] dark:text-white/65
               hover:text-[#4A6FA5] transition-colors cursor-target gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              目录
            </Link>
            <ThemePage />
          </div>
        </header>
        <motion.main
          initial={{ opacity: 0, y: 150, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <header>
            <Title>{note && note.title}</Title>
          </header>

          <section className="min-h-screen">
            {note && <NoteListCard
              note={note}
              handleUid={handleUid}
            />}
          </section>
        </motion.main>
      </NextRouter>

      <motion.nav
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        className="hidden lg:flex z-50 fixed left-[4%] top-[15%] animate-fade-in duration-700"
        aria-label="笔记目录导航"
      >
        <NoteDirectory notes={allNotes} activeNoteId={note?.id} />
      </motion.nav>

      <footer
        className="fixed bottom-[3%] left-[3%] "
      >
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          variant="outline"
          aria-label="返回顶部"
          className="bg-sky-100/80 text-sky-700 hover:bg-sky-200/70 dark:bg-slate-700/60 dark:text-sky-200"
        >
          <span className="hidden md:inline-block">返回顶部</span>
          <ArrowUpIcon />
        </Button>
      </footer>
    </TechBackgroundNoGrid>
  );
}
