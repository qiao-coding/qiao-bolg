"use client";
// 笔记详情页面组件 - 展示笔记标题和页面导航
import NextRouter from "@/components/layout/NextRouter";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageNavigation from "@/components/features/notes/PageNavigation";
import LoadingPage from "@/components/ui/public/loadingPage";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import { useNotes } from "@/hooks/note/useNotes";
import { Note, NotesPage } from "@/types/note/type";
import { NoteListCard } from "@/components/features/notes/noteListCard";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { ArrowUpIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import ThemePage from "@/components/ui/public/themePage";

export default function NoteDetailPage() {
  const { notesID } = useParams();
  const router = useRouter();

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);

  //获取noteList(GET)
  useEffect(() => {
    const fetchNotes = async () => {
      if (!notesID) return

      try {
        const res = await useNotes.getNoteList(notesID as string)
        if (res) {
          setNote(res)
          setLoading(true)
        }
      } catch (error) {
        console.error('数据获取失败', error);
        setLoading(false)

      } finally {
      }
    }
    fetchNotes()
  }, [notesID])

  const handleUid = (notePageID: string) => {
    router.push(`/notes/${notesID}/${notePageID}`);
  };

  if (!note || !loading) {
    return (
      <section className="fixed inset-0 flex items-center justify-center">
        <TechBackgroundNoGrid>
          <LoadingPage />
        </TechBackgroundNoGrid>
      </section>
    );
  }
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
          <ThemePage />
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

      <nav className=" hidden lg:flex  z-50
       flex flex-col  
       fixed right-[5%] lg:right-[10%] top-[15%]
         md:right-[-20%] sm:right-[-20%]
         h-50 
          " aria-label="笔记目录导航">
        <span className="text-amber-50 text-base my-4 opacity-70 ">
          <p className="mx-1 text-sky-500 dark:text-slate-300 text-3xl font-bold">笔记目录</p>
        </span>
        <PageNavigation
          notesPage={note?.page as NotesPage[]}
          pageStyle='text-amber-50 opacity-70'
          activeStyle='text-blue-400 font-bold' />
      </nav>

      <footer
        className="fixed bottom-[3%] left-[3%] "
      >
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          variant="outline"
          aria-label="返回顶部"
          className="bg-card/60 text-black dark:text-white"
        >
          <span className="hidden md:inline-block">返回顶部</span>
          <ArrowUpIcon />
        </Button>
      </footer>
    </TechBackgroundNoGrid>
  );
}