import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createDeepSeekClient } from "../../ai/lib/client";
import { buildSystemPrompt } from "../../ai/lib/persona";

// ---------------------------------------------------------------------------
// Public, read-only RAG lookup over notes. No auth required.
// Keyword search (DeepSeek has no embedding API) + scoring + excerpt + LLM answer.
// ---------------------------------------------------------------------------

const MAX_QUESTION_LEN = 500;
const MAX_CONTEXT_CHARS = 8000;
const RATE_LIMIT = 20; // requests per minute per IP (best-effort)

// Best-effort in-memory rate limiting
const hitLog = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - 60_000;
  const hits = (hitLog.get(ip) ?? []).filter((t) => t >= windowStart);
  hits.push(now);
  hitLog.set(ip, hits);
  if (hits.length > RATE_LIMIT) {
    hitLog.delete(ip); // reset so the user can retry next minute
    return true;
  }
  return false;
}

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

/** Extract ≤6 search keywords from a question (latin words + CJK windows). */
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

  // Fallback: whole normalized question
  if (keywords.size === 0) add(normalized.slice(0, 60));
  return [...keywords];
}

type Candidate = {
  kind: "note" | "page";
  title: string;
  href: string;
  excerpt: string;
  score: number;
  date: string | null;
};

const DAY = 24 * 60 * 60 * 1000;

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

function scoreText(text: string, keywords: string[]): number {
  let s = 0;
  for (const k of keywords) if (text.includes(k)) s++;
  return s;
}

// ---------------------------------------------------------------------------
// POST
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // --- Rate limit (best-effort) ---
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests, try again later" }, { status: 429 });
  }

  // --- Validate question ---
  let question: string;
  try {
    const body = await req.json();
    question = (body.question ?? "").toString().trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!question) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }
  if (question.length > MAX_QUESTION_LEN) {
    return NextResponse.json({ error: "question too long" }, { status: 400 });
  }

  // --- Keyword extraction ---
  const keywords = extractKeywords(question);

  // --- Retrieve candidates (skip when no keywords — persona questions only) ---
  type NoteWithPages = Prisma.NoteGetPayload<{ include: { page: true } }>;
  type PageWithNote = Prisma.NotesPageGetPayload<{ include: { note: true } }>;
  let noteRows: NoteWithPages[] = [];
  let pageRows: PageWithNote[] = [];
  if (keywords.length > 0) {
    [noteRows, pageRows] = await Promise.all([
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
  }

  const candidates: Candidate[] = [];

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

  // --- Rank: score desc, +1 recency (180d), tiebreak date desc ---
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
  const top = candidates.slice(0, 5);

  // --- Assemble bounded context ---
  let context = "";
  for (const [i, c] of top.entries()) {
    const label = c.kind === "note" ? "笔记" : "页面";
    const block = `[${i + 1}] ${label}「${c.title}」\n${c.excerpt}\n\n`;
    if (context.length + block.length > MAX_CONTEXT_CHARS) break;
    context += block;
  }

  // --- LLM answer (persona + blog info + note materials) ---
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const RAG_TASK_PROMPT = `Now answer the user's question.

Rules:
- If the question is about the blog, the blogger, or personal info, answer using 【关于我】 above.
- Otherwise answer using the numbered materials in the user message (cite as [1], [2], ...).
- If neither has relevant information, say you could not find anything related.
- Answer in the same language as the question (Chinese questions → Chinese).
- Do not mention retrieval or searching mechanisms.`;

  try {
    const client = createDeepSeekClient(apiKey || "missing");
    const completion = await client.chat.completions.create({
      model: "deepseek-v4-flash",
      messages: [
        { role: "system", content: await buildSystemPrompt(RAG_TASK_PROMPT) },
        {
          role: "user",
          content: `Question:\n${question}\n\nMaterials:\n${
            context.trim() || "(没有检索到相关笔记材料)"
          }`,
        },
      ],
      temperature: 0.3,
      max_tokens: 800,
    });
    const answer = completion.choices[0]?.message?.content?.trim() || "没有找到相关内容。";

    const sources = top.map((c) => ({
      title: c.title,
      href: c.href,
      excerpt: c.excerpt.slice(0, 160),
    }));

    return NextResponse.json({ answer, sources });
  } catch (err) {
    console.error("RAG answer failed:", err);
    return NextResponse.json(
      { error: "AI 服务暂时不可用，请稍后再试" },
      { status: 500 }
    );
  }
}
