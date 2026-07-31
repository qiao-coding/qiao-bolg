'use client'
// 学习笔记页面客户端组件 - 展示笔记列表
import NextRouter from "@/components/layout/NextRouter";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import NotesCard from "@/components/features/notes/noteCard";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { ArrowUpIcon } from "lucide-react";
import { useT } from "@/i18n/LocaleContext";
import { Note } from "@/types/note/type";
import { motion } from "framer-motion";

interface NotesPageClientProps {
  notes: Note[];
}

export default function NotesPageClient({ notes }: NotesPageClientProps) {
  const t = useT();

  return (
    <TechBackgroundNoGrid>
      <NextRouter>
        <motion.div
          initial={{ opacity: 0, y: 150, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <main className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen max-w-5xl mx-auto pt-28" aria-labelledby="notes-title">
            {/* 标题区 */}
            <header className="text-center mb-16">
              <Title>{t('notes.pageTitle')}</Title>
            </header>

            {/* 笔记列表 */}
            {notes.length > 0 ? (
              <nav aria-label="笔记列表" className="border-t border-border/60" role="list">
                {notes.map((note, index) => (
                  <NotesCard key={note.id} note={note} index={index} />
                ))}
              </nav>
            ) : (
              <section className="flex flex-col justify-center items-center" aria-live="polite">
                <p className="text-3xl text-sky-400 dark:text-white font-bold">{t('notes.noMatch')}</p>
              </section>
            )}

            {/* 页脚 */}
            <footer className="mt-16 pt-8 border-t border-border/60 text-center">
              <p className="text-xs text-muted-foreground/60 font-mono">
                {notes.length} collections &mdash; notes archive
              </p>
            </footer>
          </main>
        </motion.div>
      </NextRouter>

      {/* 返回顶部 */}
      <footer className="fixed bottom-[3%] left-[3%]">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          variant="outline"
          aria-label={t('common.backToTop')}
          className="bg-card/60 text-foreground"
        >
          <span className="hidden md:inline-block">{t('common.backToTop')}</span>
          <ArrowUpIcon aria-hidden="true" />
        </Button>
      </footer>
    </TechBackgroundNoGrid>
  );
}
