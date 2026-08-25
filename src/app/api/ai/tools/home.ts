import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// 主页聊天（/api/agent/query）的只读工具 executor。
// 全部纯只读，供 streamText() 的 tool({ execute }) 使用，由模型按需调用。
// 检索算法（停用词 / extractKeywords / 评分 / makeExcerpt / SQL）从旧路由搬来，不重写。
// ---------------------------------------------------------------------------

const LATIN_STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "do", "does", "did", "have", "has", "had", "will", "would", "can", "could",
  "should", "shall", "may", "might", "must", "of", "in", "on", "at", "to",
  "for", "from", "with", "and", "or", "but", "not", "how", "what", "why",
  "when", "where", "which", "who", "whom", "this", "that", "these", "those",
  "it", "its", "me", "my", "you", "your", "about", "explain", "tell", "about",
  "please", "show", "give", "want", "need", "help", "me",
]);

const CJK_STOPWORDS = new Set([
  "的", "了", "是", "在", "和", "与", "或", "被", "把", "让", "就", "都",
  "要", "会", "能", "可", "可以", "怎么", "什么", "如何", "为什么", "怎样",
  "请问", "一下", "给我", "解释", "讲讲", "说说", "介绍", "这个", "那个",
]);

function normalize(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*_`>\-]|!\[.*?\]\(.*?\)/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Extract ≤6 search keywords from a query (latin words + CJK windows). */
function extractKeywords(question: string): string[] {
  const normalized = normalize(question);
  if (!normalized) return [];

  const keywords = new Set<string>();
  const add = (k: string) => {
    if (k.length >= 2 && keywords.size < 6) keywords.add(k);
  };

  // Latin words
  for (const word of normalized.split(/[^\p{L}\p{N}]+/u)) {
    if (/^[\x00-\x7F]+$/.test(word) && !LATIN_STOPWORDS.has(word)) add(word);
  }

  // CJK runs: ≤4 chars keep whole, longer take sliding 2-4 char windows
  const cjkRuns = normalized.match(/[一-鿿]+/g) ?? [];
  for (const run of cjkRuns) {
    if (run.length <= 4) {
      if (!CJK_STOPWORDS.has(run)) add(run);
    } else {
      for (let w = 4; w >= 2 && keywords.size < 6; w--) {
        for (let i = 0; i + w <= run.length && keywords.size < 6; i++) {
          const seg = run.slice(i, i + w);
          if (!CJK_STOPWORDS.has(seg)) add(seg);
        }
      }
    }
    if (keywords.size >= 6) break;
  }

  // Fallback: whole normalized query
  if (keywords.size === 0) add(normalized.slice(0, 60));
  return [...keywords];
}

function scoreText(text: string, keywords: string[]): number {
  let s = 0;
  for (const k of keywords) if (text.includes(k)) s++;
  return s;
}

/** Slice an excerpt around the first keyword occurrence (or first 300 chars). */
function makeExcerpt(text: string, keywords: string[]): string {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[.*?\]\(.*?\)/g, " ")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "";

  let idx = -1;
  for (const k of keywords) {
    const i = cleaned.indexOf(k);
    if (i >= 0) { idx = i; break; }
  }
  if (idx < 0) return cleaned.slice(0, 300);
  return cleaned.slice(Math.max(0, idx - 150), idx + 150);
}

const DAY = 24 * 60 * 60 * 1000;

export type SearchHit = {
  kind: "note" | "page";
  title: string;
  href: string;
  excerpt: string;
};

/**
 * search_notes executor：关键词检索笔记 + 页面，评分排名取 top-5。
 * 只返回标题 + 链接 + 摘要（不含全文），全文由 read_note 按需读取。
 */
export async function searchNotes(query: string): Promise<SearchHit[]> {
  const keywords = extractKeywords(query);
  if (keywords.length === 0) return [];

  const [noteRows, pageRows] = await Promise.all([
    prisma.note.findMany({
      where: {
        OR: [
          { title: { contains: keywords[0] } },
          { tags: { hasSome: keywords } },
        ],
      },
      include: { page: { orderBy: { dateEnd: "desc" } } },
      take: 20,
    }),
    prisma.notesPage.findMany({
      where: {
        OR: [
          { title: { contains: keywords[0] } },
          { content: { contains: keywords[0] } },
          { pageTags: { hasSome: keywords } },
        ],
      },
      include: { note: true },
      take: 30,
    }),
  ]);

  const candidates: Array<SearchHit & { score: number; date: string | null }> = [];

  // Note category matches
  for (const note of noteRows) {
    const titleScore = scoreText(note.title.toLowerCase(), keywords) * 3;
    const tagScore =
      note.tags.filter((t) => keywords.some((k) => t.toLowerCase().includes(k))).length * 2;
    if (titleScore + tagScore === 0) continue;
    const firstPage = note.page[0];
    const excerpt = firstPage ? makeExcerpt(firstPage.content, keywords) : note.title;
    candidates.push({
      kind: "note",
      title: note.title,
      href: `/notes/${note.id}`,
      excerpt,
      score: titleScore + tagScore,
      date: firstPage?.dateEnd ?? null,
    });
  }

  // Page matches
  for (const page of pageRows) {
    const titleScore = scoreText(page.title.toLowerCase(), keywords) * 3;
    const tagScore =
      page.pageTags.filter((t) => keywords.some((k) => t.toLowerCase().includes(k))).length * 2;
    const contentScore = scoreText(page.content.toLowerCase(), keywords);
    const total = titleScore + tagScore + contentScore;
    if (total === 0) continue;
    candidates.push({
      kind: "page",
      title: page.title,
      href: `/notes/${page.noteId}/${page.uid}`,
      excerpt: makeExcerpt(page.content, keywords) || page.title,
      score: total,
      date: page.dateEnd ?? null,
    });
  }

  // Rank: score desc, +1 recency (180d), tiebreak date desc
  const now = Date.now();
  candidates.sort((a, b) => {
    const aDate = a.date ? new Date(a.date).getTime() : 0;
    const bDate = b.date ? new Date(b.date).getTime() : 0;
    const aRecency = now - aDate < 180 * DAY ? 1 : 0;
    const bRecency = now - bDate < 180 * DAY ? 1 : 0;
    const aTotal = a.score + aRecency;
    const bTotal = b.score + bRecency;
    if (aTotal !== bTotal) return bTotal - aTotal;
    return bDate - aDate;
  });

  return candidates.slice(0, 5).map(({ kind, title, href, excerpt }) => ({
    kind,
    title,
    href,
    excerpt,
  }));
}

const READ_LIMIT = 4000;

/**
 * read_note executor：按链接或 id 读取某篇笔记/页面的全文（上限 4000 字）。
 * target 形如 `/notes/3`、`/notes/3/abc-uid` 或裸数字 id。
 * 未命中返回 null。
 */
export async function readNote(
  target: string
): Promise<{ title: string; href: string; content: string } | null> {
  const m = target.match(/\/notes\/(\d+)(?:\/([^/]+))?/);
  const noteId = m ? Number(m[1]) : Number(target);
  const uid = m?.[2] ?? null;
  if (!Number.isInteger(noteId) || noteId <= 0) return null;

  if (uid) {
    const page = await prisma.notesPage.findFirst({
      where: { noteId, uid },
    });
    if (!page) return null;
    return {
      title: page.title,
      href: `/notes/${noteId}/${uid}`,
      content: page.content.slice(0, READ_LIMIT),
    };
  }

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: { page: { orderBy: { dateStart: "asc" } } },
  });
  if (!note) return null;
  const firstPage = note.page[0];
  return {
    title: note.title,
    href: `/notes/${noteId}`,
    content: (firstPage?.content ?? note.title).slice(0, READ_LIMIT),
  };
}

/**
 * list_notes executor：浏览全部笔记（标题 + 链接 + 标签），不含正文。
 */
export async function listNotes(): Promise<
  { id: number; title: string; href: string; tags: string[] }[]
> {
  const notes = await prisma.note.findMany({
    orderBy: { id: "desc" },
    take: 50,
  });
  return notes.map((n) => ({
    id: n.id,
    title: n.title,
    href: `/notes/${n.id}`,
    tags: n.tags,
  }));
}
