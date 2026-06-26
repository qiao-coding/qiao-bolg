'use client';

import { NotesPage } from '@/types/note/type';
import { getPromptMeta } from '@/lib/parse-frontmatter';
import NextRouter from '@/components/layout/NextRouter';
import TechBackgroundNoGrid from '@/components/ui/public/background_img';
import Title from '@/components/ui/public/title';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/LocaleContext';
import { User, Layers, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { useState } from 'react';

interface PromptsPageClientProps {
  prompts: NotesPage[];
  noteId: number;
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

export default function PromptsPageClient({ prompts, noteId }: PromptsPageClientProps) {
  const t = useT();
  const [copiedAll, setCopiedAll] = useState(false);

  const parsed = prompts
    .map((p) => ({ page: p, meta: getPromptMeta(p.content) }))
    .filter((p) => p.meta !== null)
    .sort((a, b) => (a.meta!.order ?? 999) - (b.meta!.order ?? 999));

  // Build a plain-text directory for bulk copy
  const buildDirectoryText = () => {
    return parsed
      .map(({ page, meta }, i) => {
        const url = `/notes/${noteId}/${page.uid}`;
        return `${i + 1}. ${meta!.title}  [${meta!.role}] [${STAGE_LABELS[meta!.stage] || meta!.stage}]\n   ${url}`;
      })
      .join('\n\n');
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(buildDirectoryText());
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {}
  };

  return (
    <TechBackgroundNoGrid>
      <NextRouter>
        <motion.main
          initial={{ opacity: 0, y: 150, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          aria-labelledby="prompts-title"
        >
          <section className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen max-w-3xl mx-auto pt-28">
            <header>
              <Title>{t('prompts.pageTitle')}</Title>
              <p className="text-center text-muted-foreground mt-2">
                {t('prompts.workflowOrder')}: {parsed.length} prompts
              </p>

              {/* Bulk copy button */}
              <div className="flex justify-center mt-4">
                <Button onClick={handleCopyAll} variant="outline" size="sm" className="gap-2">
                  {copiedAll ? (
                    <><Check className="w-4 h-4 text-green-500" />{t('prompts.copied')}</>
                  ) : (
                    <><Copy className="w-4 h-4" />{t('prompts.copyPrompt')}</>
                  )}
                </Button>
              </div>
            </header>

            {parsed.length > 0 ? (
              <div className="mt-8 space-y-2">
                {parsed.map(({ page, meta }, index) => {
                  const url = `/notes/${noteId}/${page.uid}`;
                  return (
                    <motion.div
                      key={page.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group flex items-start gap-3 p-3 rounded-lg
                        border border-border/30 bg-card/40 backdrop-blur-sm
                        hover:bg-card/70 hover:border-primary/20 transition-all"
                    >
                      {/* 序号 */}
                      <span className="flex-shrink-0 w-7 h-7 rounded bg-primary/10
                        flex items-center justify-center text-primary font-mono text-xs mt-0.5">
                        {index + 1}
                      </span>

                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        {/* 标题 → 真实 URL */}
                        <Link
                          href={url}
                          className="font-medium text-sm text-card-foreground hover:text-primary
                            transition-colors inline-flex items-center gap-1 group/link"
                        >
                          {meta!.title}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </Link>

                        {/* 元信息行 */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-0.5 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <User className="w-3 h-3" />{meta!.role}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Layers className="w-3 h-3" />{STAGE_LABELS[meta!.stage] || meta!.stage}
                          </span>
                        </div>

                        {/* 数据库真实路由 */}
                        <p className="text-[11px] text-muted-foreground/50 font-mono mt-1 truncate">
                          {url}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
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
