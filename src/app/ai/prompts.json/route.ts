import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseFrontmatter } from '@/lib/parse-frontmatter';

export async function GET() {
  const note = await prisma.note.findFirst({
    where: { title: '提示词库' },
    include: { page: true }
  });

  const prompts = (note?.page ?? []).map((p) => {
    const { data: meta } = parseFrontmatter(p.content);
    return {
      id: (meta.id as string) || p.pageId,
      title: (meta.title as string) || p.title,
      role: (meta.role as string) || '',
      stage: (meta.stage as string) || '',
      order: (meta.order as number) ?? 999,
      whenToUse: (meta.whenToUse as string) || '',
      forbidden: meta.forbidden || [],
      next: meta.next || [],
      related: meta.related || [],

      // 真实数据库 URL
      urls: {
        zh: `/zh/notes/${note?.id}/${p.uid}`,
        en: `/en/notes/${note?.id}/${p.uid}`,
      },

      // 目录页 URL
      contentsUrl: {
        zh: `/zh/notes/${note?.id}/contents`,
        en: `/en/notes/${note?.id}/contents`,
      },

      dateStart: p.dateStart,
      dateEnd: p.dateEnd,
    };
  });

  // 按 order 排序
  prompts.sort((a, b) => a.order - b.order);

  return NextResponse.json({
    site: 'AI Software Development Prompt Library',
    description: 'Structured prompt library for AI-assisted software development workflows.',
    version: '1.0.0',
    total: prompts.length,
    recommended_reading_order: prompts.map((p) => `/ai/prompts.json?id=${p.id}`),
    rules: [
      'Use one prompt per development phase.',
      'Do not mix planning, implementation, review, and testing in one task.',
      'Implementation prompts must specify allowed and forbidden files.',
      'Review prompts must not add new features.',
      'QA prompts must produce executable test cases.',
    ],
    prompts,
  });
}
