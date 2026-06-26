/**
 * 导入 prompts/*.md 到数据库
 * 用法: npx tsx scripts/import-prompts.ts
 *
 * 将每个提示词 Markdown 文件作为 NotesPage 存入"提示词库"Note 分类下。
 * content 字段保留完整 frontmatter + body，由博客前端渲染时解析。
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const PROMPTS_DIR = path.resolve(__dirname, '../prompts');
const CATEGORY_TITLE = '提示词库';

interface PromptFrontmatter {
  id: string;
  title: string;
  role: string;
  stage: string;
  order: number;
  whenToUse?: string;
  inputs?: string[];
  outputs?: string[];
  forbidden?: string[];
  acceptanceCriteria?: string[];
  next?: string[];
  related?: string[];
}

/**
 * 简单解析 YAML-like frontmatter（不依赖第三方库）
 */
function parseFrontmatter(content: string): { data: Record<string, unknown>; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: content };

  const frontmatterStr = match[1];
  const body = match[2];

  const data: Record<string, unknown> = {};
  let currentKey = '';

  for (const line of frontmatterStr.split('\n')) {
    // 匹配 key: value
    const kvMatch = line.match(/^(\w+):\s*(.*)/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();
      if (value === '') {
        // 空值 → 可能是数组的开始
        data[currentKey] = [];
      } else if (/^\d+$/.test(value)) {
        data[currentKey] = parseInt(value, 10);
      } else {
        data[currentKey] = value;
      }
    } else {
      // 匹配数组项 - item
      const arrMatch = line.match(/^\s+-\s+(.*)/);
      if (arrMatch && currentKey) {
        if (!Array.isArray(data[currentKey])) {
          data[currentKey] = [];
        }
        (data[currentKey] as string[]).push(arrMatch[1]);
      }
    }
  }

  return { data, body };
}

function formatDate(): string {
  return new Date().toLocaleString('sv-SE');
}

async function main() {
  console.log('📂 读取 prompts 目录...');
  const files = fs.readdirSync(PROMPTS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort(); // 按文件名排序 (00-, 01-, ...)

  if (files.length === 0) {
    console.log('❌ 没有找到 .md 文件');
    await prisma.$disconnect();
    return;
  }

  console.log(`📄 找到 ${files.length} 个提示词文件\n`);

  // 1. 查找或创建"提示词库"Note 分类
  let category = await prisma.note.findFirst({
    where: { title: CATEGORY_TITLE }
  });

  if (!category) {
    category = await prisma.note.create({
      data: {
        title: CATEGORY_TITLE,
        tags: ['prompts', 'workflow', 'ai'],
      }
    });
    console.log(`✅ 创建「${CATEGORY_TITLE}」分类 (id: ${category.id})`);
  } else {
    console.log(`📌 使用已有「${CATEGORY_TITLE}」分类 (id: ${category.id})`);
  }

  // 2. 逐文件导入
  let imported = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(PROMPTS_DIR, file);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const { data, body } = parseFrontmatter(rawContent);

    const fm = data as unknown as PromptFrontmatter;

    if (!fm.title || !fm.id) {
      console.log(`⚠️  跳过 ${file}: 缺少 title 或 id`);
      skipped++;
      continue;
    }

    const uid = crypto.randomUUID();
    const pageId = fm.id; // 使用 id 作为 pageId，方便查找

    // 检查是否已存在（通过 pageId 去重）
    const existing = await prisma.notesPage.findFirst({
      where: { pageId }
    });

    if (existing) {
      // 更新已有记录
      await prisma.notesPage.update({
        where: { id: existing.id },
        data: {
          title: fm.title,
          content: rawContent, // 完整 frontmatter + body
          pageTags: [fm.role || '', fm.stage || ''],
          dateEnd: formatDate(),
        }
      });
      console.log(`🔄 更新: ${fm.title} (${file})`);
    } else {
      // 新建记录
      await prisma.notesPage.create({
        data: {
          uid,
          pageId,
          title: fm.title,
          content: rawContent,
          author: 'system',
          dateStart: formatDate(),
          dateEnd: formatDate(),
          pageTags: [fm.role || '', fm.stage || ''],
          noteId: category.id,
        }
      });
      console.log(`✅ 导入: ${fm.title} (${file})`);
    }
    imported++;
  }

  console.log(`\n📊 完成: 导入 ${imported} 个, 跳过 ${skipped} 个`);
  console.log(`📌 分类: 「${CATEGORY_TITLE}」(id: ${category.id})`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ 导入失败:', e);
  prisma.$disconnect();
  process.exit(1);
});
