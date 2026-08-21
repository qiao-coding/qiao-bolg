'use client'
// 学习笔记页面客户端组件 - 展示笔记列表
import NextRouter from "@/components/layout/NextRouter";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import NotesCard from "@/components/features/notes/noteCard";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { ArrowUpIcon, BookOpen } from "lucide-react";
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
        <div className="px-4 sm:px-6 lg:px-8">
          <main className="min-h-screen max-w-6xl mx-auto pb-20 pt-28" aria-labelledby="notes-title">
            {/* 标题区 */}
            <header className="mb-10 border-b border-brand-pink/15 pb-8 text-center">
              <div>
                <Title>{t('notes.pageTitle')}</Title>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-md border border-brand-pink/20 bg-white/70 px-3 py-1.5 text-sm text-brand-pink-deep dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]">
                    <BookOpen className="size-4" />
                    {notes.length} collections
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-md border border-brand-pink/20 bg-white/70 px-3 py-1.5 text-sm text-brand-pink-deep dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]">
                    {notes.reduce((total, note) => total + (note.page?.length ?? 0), 0)} pages
                  </span>
                </div>
              </div>
            </header>

            {/* 笔记列表 */}
            {notes.length > 0 ? (
              <nav aria-label="笔记列表" className="divide-y divide-brand-pink/10 border-y border-brand-pink/10 bg-white/42 dark:divide-[#8fb7df]/16 dark:border-[#8fb7df]/18 dark:bg-[#202a3f]/72" role="list">
                {notes.map((note, index) => (
                  <NotesCard key={note.id} note={note} index={index} />
                ))}
              </nav>
            ) : (
              <section className="flex flex-col justify-center items-center rounded-3xl border border-white/80 bg-white/74 p-10 shadow-sm backdrop-blur-md dark:border-[#8fb7df]/20 dark:bg-[#202a3f]" aria-live="polite">
                <p className="text-lg font-medium text-muted-foreground">{t('notes.noMatch')}</p>
              </section>
            )}

            {/* 页脚 */}
            <footer className="mt-12 pt-8 text-center">
              <p className="text-xs text-muted-foreground/60 font-mono">
                {notes.length} collections - notes archive
              </p>
            </footer>
          </main>
        </div>
      </NextRouter>

      {/* 返回顶部 */}
      <footer className="fixed bottom-[3%] left-[3%]">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          variant="outline"
          aria-label={t('common.backToTop')}
          className="border-border bg-card/90 text-foreground"
        >
          <span className="hidden md:inline-block">{t('common.backToTop')}</span>
          <ArrowUpIcon aria-hidden="true" />
        </Button>
      </footer>
    </TechBackgroundNoGrid>
  );
}
