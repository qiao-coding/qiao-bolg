'use client'
// 学习笔记页面客户端组件 - 展示笔记列表
import NextRouter from "@/components/layout/NextRouter";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import NotesCard from "@/components/features/notes/noteCard";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { ArrowUpIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useT } from "@/i18n/LocaleContext";
import { Note } from "@/types/note/type";

interface NotesPageClientProps {
  notes: Note[];
}

export default function NotesPageClient({ notes }: NotesPageClientProps) {
  const t = useT();

  return (
    <TechBackgroundNoGrid>
      <NextRouter>
        <motion.div
          initial={{ opacity: 0, y: 150 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <main className="max-w-[720px] mx-auto pt-28 pb-24 px-6" aria-labelledby="notes-title">
            {/* 标题区 */}
            <header className="mb-10">
              <Title>{t('notes.pageTitle')}</Title>
            </header>

            {/* 笔记列表 - 独立卡片 + 交错动画 */}
            {notes.length > 0 ? (
              <div className="flex flex-col gap-3" role="list">
                {notes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.06,
                      ease: "easeOut",
                    }}
                  >
                    <NotesCard note={note} index={index} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <section
                className="flex flex-col justify-center items-center py-20"
                aria-live="polite"
              >
                <p className="text-2xl text-muted-foreground font-bold">
                  {t('notes.noMatch')}
                </p>
              </section>
            )}

            {/* 页脚 */}
            <footer className="mt-12 text-center">
              <p className="text-xs text-muted-foreground/50 font-mono">
                {notes.length} collections
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
