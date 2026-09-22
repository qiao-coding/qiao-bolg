import { NextRequest, NextResponse } from "next/server";
import { streamText, tool, isStepCount } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";
import { buildSystemPrompt } from "../../ai/lib/persona";
import { searchNotes, readNote, listNotes, type SearchHit } from "../../ai/tools/home";

// ---------------------------------------------------------------------------
// 主页悬浮 AI 聊天的公开只读 agent（无 auth）。
// 用 Vercel AI SDK 的 tool-calling 循环：模型按需调用 search_notes / read_note /
// list_notes，不再每次把全部上下文塞进 prompt。noteContext 只作为 hint 提供
// 元数据（标题/分类/链接/标签），需要全文时由模型调用 read_note 读取。
// ---------------------------------------------------------------------------

export const maxDuration = 60;

const MAX_QUESTION_LEN = 500;
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

type Source = { title: string; href: string; excerpt: string };

type NoteHint = {
  title: string;
  category: string;
  href: string;
  tags: string[];
};

function normalizeNoteHint(input: unknown): NoteHint | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const category = typeof raw.category === "string" ? raw.category.trim() : "";
  const href = typeof raw.href === "string" ? raw.href.trim() : "";
  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((tag): tag is string => typeof tag === "string").slice(0, 8)
    : [];
  if (!title) return null;
  return {
    title: title.slice(0, 180),
    category: category.slice(0, 120),
    href: href.slice(0, 240),
    tags,
  };
}

const HOME_AGENT_PROMPT = `你是「小小乔の小站」博客助手。回答用户的提问。

回答规则：
1. 先判断问题类型，默认不要调用工具：
   - 关于博主本人、博客介绍、闲聊、建议、常识类问题 → 直接用系统提示里的【关于我】和你的常识回答，绝对不要调用工具。
   - 只有当问题需要博客笔记里的具体内容（某个技术主题、某篇文章讲了什么、某个知识点）时，才调用工具。
2. 调用工具时按需、克制，不要贪多：
   - search_notes(query)：检索笔记，返回标题 + 链接 + 摘要列表（不含全文）。**只调用一次**，把要检索的关键词一次性写全。**同一轮只调用一个工具，严禁并行调用多个工具、严禁同时发多个搜索请求**；第一次搜索结果已够回答就不要再搜。
   - read_note(target)：按链接或 id 读取某篇笔记/页面的全文（target 形如 /notes/3 或 /notes/3/uid）。**最多读 1~2 篇**最关键的文章；摘要已经能回答的，就不要读全文。
   - list_notes()：列出全部笔记（标题 + 链接 + 标签）。
3. 调用工具之前不要输出任何文字，先拿结果，再一次性组织回答。
4. 引用资料时用 markdown 链接形式：[标题](链接)，链接保持相对路径（形如 /notes/3 或 /notes/3/uid），不要拼接域名。
5. 找不到相关内容时，直接说明没有找到，不要编造。
6. 用提问所用的语言回答（中文问题用中文）。
7. 不要提及工具或检索机制。`;

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

  // --- Validate question + optional conversation history + current-note hint ---
  let question: string;
  let history: { role: "user" | "assistant"; content: string }[] = [];
  let noteHint: NoteHint | null = null;
  try {
    const body = await req.json();
    question = (body.question ?? "").toString().trim();
    noteHint = normalizeNoteHint(body.noteContext);
    if (Array.isArray(body.history)) {
      history = (body.history as unknown[])
        .filter((m): m is { role: "user" | "assistant"; content: string } => {
          if (!m || typeof m !== "object") return false;
          const r = (m as { role?: unknown }).role;
          const c = (m as { content?: unknown }).content;
          return (r === "user" || r === "assistant") && typeof c === "string";
        })
        .slice(-6); // keep the last 6 turns for context
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!question) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }
  if (question.length > MAX_QUESTION_LEN) {
    return NextResponse.json({ error: "question too long" }, { status: 400 });
  }

  // --- noteContext: metadata hint only (no full content) ---
  const noteHintBlock = noteHint
    ? `

【当前正在阅读】标题：《${noteHint.title}》｜分类：${noteHint.category || "-"}｜链接：${noteHint.href || "-"}｜标签：${noteHint.tags.join(" / ") || "-"}
如果用户的问题与当前笔记相关（如「这篇讲了什么」「上面的内容」「本文」，或追问当前文章细节），请调用 read_note 读取《${noteHint.title}》的全文后再回答。`
    : "";

  const apiKey = process.env.DEEPSEEK_API_KEY;

  // --- Agent loop: model decides which read-only tool to call ---
  const deepseek = createOpenAICompatible({
    name: "deepseek",
    baseURL: "https://api.deepseek.com/v1",
    apiKey: apiKey || "missing",
  });

  const result = streamText({
    model: deepseek("deepseek-v4-flash"),
    system: await buildSystemPrompt(HOME_AGENT_PROMPT + noteHintBlock),
    messages: [
      // Prior turns give the model conversational context for follow-ups.
      ...history,
      { role: "user", content: question },
    ],
    tools: {
      search_notes: tool({
        description:
          "检索博客笔记，返回相关笔记的标题、链接和摘要列表（不含全文）。用关键词描述想找的内容。",
        inputSchema: z.object({ query: z.string().describe("搜索关键词") }),
        execute: async ({ query }) => {
          // 检索失败（如 DB 抖动）时返回空列表，不让单次工具错误杀掉整个回答流。
          try {
            return await searchNotes(query);
          } catch (err) {
            console.error("search_notes failed:", err);
            return [];
          }
        },
      }),
      read_note: tool({
        description:
          "按链接或 id 读取某篇笔记/页面的完整内容（最多 4000 字）。target 形如 /notes/3 或 /notes/3/uid，也可以是数字 id。",
        inputSchema: z.object({ target: z.string().describe("笔记链接或 id") }),
        execute: async ({ target }) => {
          try {
            return await readNote(target);
          } catch (err) {
            console.error("read_note failed:", err);
            return null;
          }
        },
      }),
      list_notes: tool({
        description: "列出全部笔记（标题 + 链接 + 标签），用于浏览博客有哪些笔记。",
        inputSchema: z.object({}),
        execute: async () => {
          try {
            return await listNotes();
          } catch (err) {
            console.error("list_notes failed:", err);
            return [];
          }
        },
      }),
    },
    stopWhen: isStepCount(5),
    temperature: 0.3,
    maxOutputTokens: 800,
  });

  // --- Map AI SDK stream to the existing SSE contract (text/sources/error/done) ---
  const encoder = new TextEncoder();
  const sendEvent = (event: unknown) => {
    return encoder.encode(`data: ${JSON.stringify(event)}\n\n`);
  };

  // noteContext source first if present (metadata as excerpt), then search hits / read results.
  const noteSource: Source | null = noteHint?.href
    ? { title: noteHint.title, href: noteHint.href, excerpt: noteHint.category }
    : null;
  let sources: Source[] = noteSource ? [noteSource] : [];

  // 去重时忽略 locale 前缀：noteContext 的 href 来自 location.pathname（带 /zh 等），
  // readNote/search 返回的是不带前缀的 /notes/...，直接比较会误判为不同条目。
  const stripLocalePrefix = (href: string) =>
    href.replace(/^\/(?:zh|en|ja|ko|fr|de|es)(?=\/)/, "");

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Emit the current-note source up front so the panel shows it even before tools run.
        if (noteSource) {
          controller.enqueue(sendEvent({ type: "sources", sources: [...sources] }));
        }
        for await (const chunk of result.stream) {
          switch (chunk.type) {
            case "text-delta": {
              controller.enqueue(sendEvent({ type: "text", content: chunk.text }));
              break;
            }
            case "tool-call": {
              controller.enqueue(sendEvent({
                type: "tool_call",
                name: chunk.toolName,
                input: chunk.input,
              }));
              break;
            }
            case "tool-result": {
              if (chunk.toolName === "search_notes") {
                // Fresh search replaces the hits, keeping the current-note source pinned first.
                const hits = (Array.isArray(chunk.output) ? chunk.output : []) as SearchHit[];
                sources = [noteSource, ...hits].filter(Boolean) as Source[];
                controller.enqueue(sendEvent({ type: "sources", sources: [...sources] }));
              } else if (chunk.toolName === "read_note") {
                // The actually-read note joins the sources (dedup by href).
                const out = (chunk.output ?? null) as
                  | { title?: string; href?: string }
                  | null;
                if (out && typeof out.title === "string" && typeof out.href === "string") {
                  if (!sources.some((s) => stripLocalePrefix(s.href) === stripLocalePrefix(out.href!))) {
                    sources.push({ title: out.title, href: out.href, excerpt: "" });
                    controller.enqueue(sendEvent({ type: "sources", sources: [...sources] }));
                  }
                }
              }
              break;
            }
            case "finish": {
              controller.enqueue(sendEvent({ type: "done" }));
              break;
            }
            case "error": {
              console.error("AI agent stream error:", chunk.error);
              controller.enqueue(sendEvent({
                type: "error",
                error: "AI 服务暂时不可用，请稍后再试",
              }));
              break;
            }
            // Other parts (start-step / finish-step / reasoning / text-start ...) ignored.
          }
        }
      } catch (err) {
        console.error("AI agent stream failed:", err);
        controller.enqueue(sendEvent({
          type: "error",
          error: "AI 服务暂时不可用，请稍后再试",
        }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
