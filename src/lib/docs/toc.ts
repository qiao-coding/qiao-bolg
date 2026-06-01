import GithubSlugger from "github-slugger";

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

function stripMarkdownFormatting(raw: string): string {
  return raw
    .replace(/`([^`]+)`/g, "$1")           // 行内代码
    .replace(/\!\[([^\]]*)\]\([^)]+\)/g, "$1") // 图片
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")   // 链接
    .replace(/\*\*([^*]+)\*\*/g, "$1")         // 粗体 **
    .replace(/__([^_]+)__/g, "$1")             // 粗体 __
    .replace(/\*([^*]+)\*/g, "$1")             // 斜体 *
    .replace(/_([^_]+)_/g, "$1")               // 斜体 _
    .replace(/~~([^~]+)~~/g, "$1")             // 删除线
    .replace(/<[^>]+>/g, "")                   // HTML标签
    .trim();
}

export function extractTocFromContent(content: string): TocItem[] {
  const body = content.replace(/^---[\s\S]*?---\s*/, "");
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    const m = /^(#{2,3})\s+(.+)$/.exec(trimmed);
    if (!m) continue;
    const level = m[1]!.length as 2 | 3;
    if (level !== 2 && level !== 3) continue;
    const rawTitle = m[2]!.replace(/\s+#+\s*$/, "").trim();
    if (!rawTitle) continue;
    const plainTitle = stripMarkdownFormatting(rawTitle);
    if (!plainTitle) continue;
    const id = slugger.slug(plainTitle);
    items.push({ id, title: plainTitle, level });
  }

  return items;
}
