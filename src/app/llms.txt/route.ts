import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const note = await prisma.note.findFirst({
    where: { title: '提示词库' },
    include: { page: true }
  });

  const prompts = (note?.page ?? [])
    .map((p) => {
      const orderMatch = p.content.match(/^---[\s\S]*?order:\s*(\d+)[\s\S]*?---/);
      return {
        pageId: p.pageId,
        title: p.title,
        order: orderMatch ? parseInt(orderMatch[1], 10) : 999,
      };
    })
    .sort((a, b) => a.order - b.order);

  const lines = [
    '# AI Software Development Prompt Library',
    '',
    '> This site provides structured prompts for AI-assisted software development workflows.',
    '> Each prompt defines a specific role, stage, inputs, outputs, and constraints.',
    '',
    '## Core Entry Points',
    '',
    `- [Prompt Library Overview](/prompts): Complete workflow index with all ${prompts.length} prompts`,
  ];

  for (const p of prompts) {
    lines.push(`- [${p.title}](/prompts/${p.pageId}): Role-specific prompt for the development workflow`);
  }

  lines.push('');
  lines.push('## Recommended Reading Order');
  lines.push('');

  prompts.forEach((p, i) => {
    lines.push(`${i + 1}. [${p.title}](/prompts/${p.pageId})`);
  });

  lines.push('');
  lines.push('## Usage Rules');
  lines.push('');
  lines.push('- Use one prompt per development phase.');
  lines.push('- Do not mix planning, implementation, review, and testing in one task.');
  lines.push('- Implementation prompts must specify allowed and forbidden files.');
  lines.push('- Review prompts must not add new features.');
  lines.push('- QA prompts must produce executable test cases.');

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
