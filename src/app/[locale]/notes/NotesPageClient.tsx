'use client'
// 学习笔记页面客户端组件 - 展示笔记列表和侧边栏导航
import NextRouter from "@/components/layout/NextRouter";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import NotesSideber from "@/components/ui/notes/noteSideber";
import { motion } from "framer-motion";
import { Note } from "@/types/note/type";
import NotesCard from "@/components/features/notes/noteCard";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { ArrowUpIcon } from "lucide-react";
import { useT } from "@/i18n/LocaleContext";

interface NotesPageClientProps {
  notes: Note[];
}

export default function NotesPageClient({ notes }: NotesPageClientProps) {
  const t = useT();
  const { data: session } = useSession();

  return (
    <TechBackgroundNoGrid>
      <NextRouter>
        <motion.main
          initial={{ opacity: 0, y: 150, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          aria-labelledby="notes-title"
        >
          {/* 笔记列表内容区域 */}
          <section className="py-12 px-4 sm:px-6 lg:px-8
          min-h-screen max-w-5xl mx-auto pt-28">
            <header>
              <Title>{t('notes.pageTitle')}</Title>
            </header>
            <section className="flex justify-center w-full">
              {notes.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 gap-6 w-[90vw]
                   md:w-[65vw] lg:w-[50vw] m-auto"
                  role="list"
                  aria-label="笔记列表"
                >
                  {notes.map((note) => (
                    <motion.article
                      key={note.id}
                      className="cursor-pointer w-full"
                      role="listitem"
                      whileHover={{ translateY: -15, transition: { duration: 0.3 } }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <NotesCard note={note} />
                    </motion.article>
                  ))}
                </motion.div>
              ) : (
                <section
                  className="flex flex-col justify-center items-center py-20"
                  aria-live="polite"
                >
                  <p className="text-3xl text-sky-400 dark:text-white font-bold">
                    {t('notes.noMatch')}
                  </p>
                </section>
              )}
              {notes.length > 0 && session && (
                <aside
                  className="hidden lg:block lg:w-[200px] xl:w-[250px] px-0 ml-8"
                  aria-label="笔记侧边栏"
                >
                  <NotesSideber />
                </aside>
              )}
            </section>
          </section>
        </motion.main>
      </NextRouter>

      <footer className="fixed bottom-[3%] left-[3%]">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          variant="outline"
          aria-label={t('common.backToTop')}
          className="bg-card/60 text-black dark:text-white"
        >
          <span className="hidden md:inline-block">{t('common.backToTop')}</span>
          <ArrowUpIcon aria-hidden="true" />
        </Button>
      </footer>
    </TechBackgroundNoGrid>
  );
}
