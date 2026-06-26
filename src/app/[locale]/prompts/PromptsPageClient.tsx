'use client';

import { NotesPage } from '@/types/note/type';
import { getPromptMeta } from '@/lib/parse-frontmatter';
import NextRouter from '@/components/layout/NextRouter';
import TechBackgroundNoGrid from '@/components/ui/public/background_img';
import Title from '@/components/ui/public/title';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/LocaleContext';
import { ArrowRight, User, Layers } from 'lucide-react';

interface PromptsPageClientProps {
  prompts: NotesPage[];
}

const STAGE_LABELS: Record<string, string> = {
  requirements: '需求',
  scope: '范围',
  design: '设计',
  planning: '规划',
  implementation: '实现',
  review: '审查',
  testing: '测试',
  debugging: '调试',
  refactoring: '重构',
  documentation: '文档',
};

export default function PromptsPageClient({ prompts }: PromptsPageClientProps) {
  const t = useT();

  // Parse frontmatter and sort by order
  const parsed = prompts
    .map((p) => ({ page: p, meta: getPromptMeta(p.content) }))
    .filter((p) => p.meta !== null)
    .sort((a, b) => (a.meta!.order ?? 999) - (b.meta!.order ?? 999));

  return (
    <TechBackgroundNoGrid>
      <NextRouter>
        <motion.main
          initial={{ opacity: 0, y: 150, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          aria-labelledby="prompts-title"
        >
          <section className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen max-w-4xl mx-auto pt-28">
            <header>
              <Title>{t('prompts.pageTitle')}</Title>
              <p className="text-center text-muted-foreground mt-2 mb-8">
                {t('prompts.workflowOrder')}: {parsed.length} prompts
              </p>
            </header>

            {parsed.length > 0 ? (
              <div className="space-y-3">
                {parsed.map(({ page, meta }, index) => (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={`/prompts/${page.pageId}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-4 p-4 rounded-lg border border-border/40
                        bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30
                        hover:shadow-md transition-all duration-200"
                      >
                        {/* Order number */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10
                          flex items-center justify-center text-primary font-bold text-sm">
                          {meta!.order ?? index + 1}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h2 className="font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">
                            {meta!.title}
                          </h2>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {meta!.role}
                            </span>
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3" />
                              {STAGE_LABELS[meta!.stage] || meta!.stage}
                            </span>
                          </div>
                        </div>

                        {/* Arrow */}
                        <ArrowRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <section className="flex flex-col justify-center items-center py-20">
                <p className="text-xl text-muted-foreground">{t('prompts.noPrompts')}</p>
              </section>
            )}
          </section>
        </motion.main>
      </NextRouter>
    </TechBackgroundNoGrid>
  );
}
