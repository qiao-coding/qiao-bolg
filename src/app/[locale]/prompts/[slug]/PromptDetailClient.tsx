'use client';

import { NotesPage } from '@/types/note/type';
import { parseFrontmatter, type PromptMeta } from '@/lib/parse-frontmatter';
import { NotePageContent } from '@/components/features/notes/notePageContent';
import NextRouter from '@/components/layout/NextRouter';
import TechBackgroundNoGrid from '@/components/ui/public/background_img';
import { Button } from '@/components/ui/shadcnComponents/forms/button';
import { Badge } from '@/components/ui/shadcnComponents/data-display/badge';
import { useT } from '@/i18n/LocaleContext';
import { Link } from '@/i18n/navigation';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  User,
  Layers,
  Hash,
  AlertTriangle,
  FileText,
  ListChecks,
} from 'lucide-react';

interface PromptDetailClientProps {
  prompt: NotesPage;
  allPrompts: Array<{ pageId: string; title: string; order: number }>;
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

export default function PromptDetailClient({ prompt, allPrompts }: PromptDetailClientProps) {
  const t = useT();
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const { data: meta, body } = parseFrontmatter(prompt.content);
  const pm = meta as unknown as PromptMeta;

  const currentIndex = allPrompts.findIndex((p) => p.pageId === prompt.pageId);
  const prevPrompt = currentIndex > 0 ? allPrompts[currentIndex - 1] : null;
  const nextPrompt = currentIndex < allPrompts.length - 1 ? allPrompts[currentIndex + 1] : null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  return (
    <TechBackgroundNoGrid>
      <NextRouter showHeader={false}>
        {/* Header */}
        <header className="container mx-auto px-4 sm:px-6 py-8 pt-24">
          <Link
            href="/prompts"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('prompts.pageTitle')}
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-card-foreground mb-4">
            {pm.title || prompt.title}
          </h1>

          {/* Meta badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="secondary" className="gap-1">
              <Hash className="w-3 h-3" />
              {pm.id}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <User className="w-3 h-3" />
              {t('prompts.role')}: {pm.role}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Layers className="w-3 h-3" />
              {t('prompts.stage')}: {STAGE_LABELS[pm.stage] || pm.stage}
            </Badge>
            {pm.order !== undefined && (
              <Badge variant="outline">Order: {pm.order}</Badge>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 sm:px-6 pb-16 max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            {/* Left: Markdown body */}
            <div className="min-w-0">
              <div className="bg-card/60 backdrop-blur-sm rounded-lg border border-border/40 p-6">
                <NotePageContent
                  content={body}
                  theme={theme as 'light' | 'dark'}
                />
              </div>
            </div>

            {/* Right: Metadata sidebar */}
            <aside className="space-y-4">
              {/* Copy button */}
              <Button
                onClick={handleCopy}
                variant="outline"
                className="w-full gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    {t('prompts.copied')}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    {t('prompts.copyPrompt')}
                  </>
                )}
              </Button>

              {/* When to use */}
              {pm.whenToUse && (
                <div className="bg-card/60 backdrop-blur-sm rounded-lg border border-border/40 p-4">
                  <h3 className="text-sm font-semibold text-card-foreground mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary" />
                    {t('prompts.whenToUse')}
                  </h3>
                  <p className="text-sm text-muted-foreground">{pm.whenToUse}</p>
                </div>
              )}

              {/* Inputs */}
              {pm.inputs && pm.inputs.length > 0 && (
                <div className="bg-card/60 backdrop-blur-sm rounded-lg border border-border/40 p-4">
                  <h3 className="text-sm font-semibold text-card-foreground mb-2">
                    {t('prompts.inputs')}
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {pm.inputs.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Outputs */}
              {pm.outputs && pm.outputs.length > 0 && (
                <div className="bg-card/60 backdrop-blur-sm rounded-lg border border-border/40 p-4">
                  <h3 className="text-sm font-semibold text-card-foreground mb-2">
                    {t('prompts.outputs')}
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {pm.outputs.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Forbidden */}
              {pm.forbidden && pm.forbidden.length > 0 && (
                <div className="bg-destructive/5 backdrop-blur-sm rounded-lg border border-destructive/20 p-4">
                  <h3 className="text-sm font-semibold text-destructive mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    {t('prompts.forbidden')}
                  </h3>
                  <ul className="text-sm text-destructive/80 space-y-1 list-disc list-inside">
                    {pm.forbidden.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>

          {/* Acceptance criteria */}
          {pm.acceptanceCriteria && pm.acceptanceCriteria.length > 0 && (
            <div className="mt-8 bg-card/60 backdrop-blur-sm rounded-lg border border-border/40 p-6">
              <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-primary" />
                {t('prompts.acceptanceCriteria')}
              </h3>
              <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
                {pm.acceptanceCriteria.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Prev/Next navigation */}
          <nav className="mt-12 flex items-center justify-between pt-6 border-t border-border/40">
            {prevPrompt ? (
              <Link
                href={`/prompts/${prevPrompt.pageId}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <div>
                  <div className="text-xs opacity-60">{t('prompts.prevPrompt')}</div>
                  <div className="font-medium">{prevPrompt.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextPrompt ? (
              <Link
                href={`/prompts/${nextPrompt.pageId}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group text-right"
              >
                <div>
                  <div className="text-xs opacity-60">{t('prompts.nextPromptSingle')}</div>
                  <div className="font-medium">{nextPrompt.title}</div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </main>
      </NextRouter>
    </TechBackgroundNoGrid>
  );
}
