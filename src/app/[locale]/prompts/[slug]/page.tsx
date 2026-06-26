import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PromptDetailClient from './PromptDetailClient';

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await prisma.notesPage.findUnique({
    where: { pageId: slug }
  });

  if (!page) {
    notFound();
  }

  // Get all prompts for prev/next navigation
  const note = await prisma.note.findFirst({
    where: { title: '提示词库' },
    include: { page: true }
  });

  const allPrompts = (note?.page ?? [])
    .map((p) => {
      const orderMatch = p.content.match(/^---[\s\S]*?order:\s*(\d+)[\s\S]*?---/);
      return {
        pageId: p.pageId,
        title: p.title,
        order: orderMatch ? parseInt(orderMatch[1], 10) : 999,
      };
    })
    .sort((a, b) => a.order - b.order);

  const serialized = JSON.parse(JSON.stringify(page));
  const serializedAll = JSON.parse(JSON.stringify(allPrompts));

  return (
    <PromptDetailClient
      prompt={serialized}
      allPrompts={serializedAll}
    />
  );
}
