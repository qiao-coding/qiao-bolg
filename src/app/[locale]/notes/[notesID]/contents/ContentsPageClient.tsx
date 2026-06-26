'use client';

import { Note } from '@/types/note/type';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/LocaleContext';
import NextRouter from '@/components/layout/NextRouter';
import TechBackgroundNoGrid from '@/components/ui/public/background_img';
import { motion } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Calendar,
  Clock,
  Hash,
  Tag,
  ArrowLeft,
  Layers,
} from 'lucide-react';

interface ContentsPageClientProps {
  note: Note;
}

export default function ContentsPageClient({ note }: ContentsPageClientProps) {
  const t = useT();
  const pages = note.page ?? [];

  return (
    <TechBackgroundNoGrid>
      <NextRouter showHeader={false}>
        {/* 顶部导航 */}
        <header className="container mx-auto px-4 sm:px-6 pt-24 pb-8">
          <Link
            href={`/notes/${note.id}`}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {note.title}
          </Link>
        </header>

        <motion.main
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="container mx-auto px-4 sm:px-6 pb-24 max-w-3xl"
        >
          {/* 目录头部 — 文档风格 */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-card-foreground mb-3 tracking-tight">
              {note.title}
            </h1>
            <p className="text-muted-foreground text-sm font-mono">
              目录 &mdash; Contents
            </p>

            {/* 统计卡片 */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-border/30 text-sm">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-card-foreground font-semibold">{pages.length}</span>
                <span className="text-muted-foreground">篇笔记</span>
              </div>
              {note.tags && note.tags.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-border/30 text-sm">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{note.tags.join(' / ')}</span>
                </div>
              )}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-border/30 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">
                  {note.createdAt ? new Date(note.createdAt).toLocaleDateString('zh-CN') : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* 目录列表 — 书籍风格 */}
          {pages.length > 0 ? (
            <nav className="space-y-0" aria-label="笔记目录">
              {pages.map((page, index) => (
                <Link
                  key={page.id}
                  href={`/notes/${note.id}/${page.uid}`}
                  className="group block"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="flex items-center gap-6 py-4 px-2
                      border-b border-border/20 last:border-b-0
                      hover:bg-primary/5 rounded-md transition-colors"
                  >
                    {/* 序号 */}
                    <span className="flex-shrink-0 w-8 text-right font-mono text-sm text-muted-foreground/50 tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* 主体 */}
                    <div className="flex-1 min-w-0">
                      <h2 className="font-serif text-base text-card-foreground group-hover:text-primary transition-colors truncate">
                        {page.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-1 text-xs text-muted-foreground/60">
                        {page.author && (
                          <span>{page.author}</span>
                        )}
                        {page.dateStart && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {page.dateStart}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 标签 */}
                    {page.pageTags && page.pageTags.length > 0 && (
                      <div className="hidden sm:flex flex-wrap gap-1 flex-shrink-0 max-w-[160px]">
                        {page.pageTags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary/70 border border-primary/10"
                          >
                            {tag}
                          </span>
                        ))}
                        {page.pageTags.length > 2 && (
                          <span className="text-[10px] text-muted-foreground/40">
                            +{page.pageTags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* 页数装饰 */}
                    <span className="flex-shrink-0 w-6 text-right text-[10px] text-muted-foreground/30 font-mono hidden sm:block">
                      ···
                    </span>
                  </motion.div>
                </Link>
              ))}
            </nav>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>{t('common.noData')}</p>
            </div>
          )}

          {/* 页脚 */}
          <footer className="mt-16 pt-8 border-t border-border/20 text-center">
            <p className="text-xs text-muted-foreground/40 font-mono">
              {note.title} &mdash; {pages.length} pages &mdash; auto-generated contents
            </p>
          </footer>
        </motion.main>
      </NextRouter>
    </TechBackgroundNoGrid>
  );
}
