'use client'
// 学习笔记页面客户端组件 - 展示笔记列表
import NextRouter from "@/components/layout/NextRouter";
import Title from "@/components/ui/public/title";
import NotesCard from "@/components/features/notes/noteCard";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { ArrowUpIcon } from "lucide-react";
import { useT } from "@/i18n/LocaleContext";
import { Note } from "@/types/note/type";

interface NotesPageClientProps {
  notes: Note[];
}

export default function NotesPageClient({ notes }: NotesPageClientProps) {
  const t = useT();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-900 dark:to-slate-800"
         style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <NextRouter>
        <main className="max-w-[720px] mx-auto pt-28 pb-24 px-6" aria-labelledby="notes-title">
          {/* 标题区 */}
          <header className="text-center mb-16">
            <Title>{t('notes.pageTitle')}</Title>
            <p className="text-muted-foreground text-sm font-mono mt-2">
              {notes.length} 篇笔记集
            </p>
          </header>

          {/* 笔记列表 */}
          {notes.length > 0 ? (
            <nav aria-label="笔记列表" className="border-t border-border/60" role="list">
              {notes.map((note, index) => (
                <NotesCard key={note.id} note={note} index={index} />
              ))}
            </nav>
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
          <footer className="mt-16 pt-8 border-t border-border/60 text-center">
            <p className="text-xs text-muted-foreground/60 font-mono">
              {notes.length} collections &mdash; notes archive
            </p>
          </footer>
        </main>
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
    </div>
  );
}
