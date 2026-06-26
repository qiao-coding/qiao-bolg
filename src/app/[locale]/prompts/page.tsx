import { prisma } from '@/lib/prisma';
import PromptsPageClient from './PromptsPageClient';

const CATEGORY_TITLE = '提示词库';

export default async function PromptsPage() {
  const note = await prisma.note.findFirst({
    where: { title: CATEGORY_TITLE },
    include: { page: true }
  });

  const prompts = note?.page ?? [];

  // Sort by frontmatter order field (parse from content)
  const sorted = [...prompts].sort((a, b) => {
    const orderA = extractOrder(a.content);
    const orderB = extractOrder(b.content);
    return orderA - orderB;
  });

  const serialized = JSON.parse(JSON.stringify(sorted));

  return <PromptsPageClient prompts={serialized} />;
}

/** Extract order from frontmatter without full parsing */
function extractOrder(content: string): number {
  const match = content.match(/^---[\s\S]*?order:\s*(\d+)[\s\S]*?---/);
  return match ? parseInt(match[1], 10) : 999;
}
