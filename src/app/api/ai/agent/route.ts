import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { noteTools, noteExecutors } from "../tools/notes";
import { blogTools, blogExecutors } from "../tools/blog";
import { contentTools, contentExecutors } from "../tools/content";
import { runAgent } from "../lib/runAgent";
import { buildSystemPrompt } from "../lib/persona";

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------
const AGENT_SYSTEM_PROMPT = `You are an AI agent that manages a personal blog (「小小乔の小站」) for the admin. You can read and write blog data through tools.

Your capabilities:
1. Notes — list, get, create, update, delete note categories and their pages; search notes by keyword.
2. Blog settings — get/update the blog name, home page hero (mainTitle, subTitle, dynamic flags), home icons list, notes sidebar (name, email, social links).
3. Friend links — list, add, update, delete friends.
4. About page — read and update the about description and its details list.
5. Miscellaneous — list, add, update, delete short statuses/quotes.

Hard rules:
- When the user asks to DELETE anything (note, page, friend, miscellaneous), ASK FOR EXPLICIT CONFIRMATION FIRST. Describe exactly what will be deleted (name/ID). Do not call the delete tool until the user confirms. New/create/update operations can be done directly.
- For create/update operations, confirm what was changed after it succeeds.
- If a tool call fails, explain the error in plain language.
- Keep responses concise and in the same language the user is using (Chinese or English).
- If the user asks something outside your tools, politely say you cannot do it and list what you can do.`;

// ---------------------------------------------------------------------------
// Tool registry: notes + blog settings + blog content
// ---------------------------------------------------------------------------
const TOOLS = [...noteTools, ...blogTools, ...contentTools];
const EXECUTORS = { ...noteExecutors, ...blogExecutors, ...contentExecutors };

// ---------------------------------------------------------------------------
// POST handler (SSE)
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // --- Auth check ---
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminUser = await prisma.adminUser.findUnique({
    where: { username: session.user.email },
  });
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // --- Parse request ---
  let messages: { role: string; content: string }[];
  try {
    const body = await req.json();
    messages = body.messages ?? [];
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages array is required" }, { status: 400 });
  }

  // --- API key: server env only ---
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  // --- SSE stream ---
  const stream = runAgent({
    systemPrompt: await buildSystemPrompt(AGENT_SYSTEM_PROMPT),
    messages,
    tools: TOOLS,
    executors: EXECUTORS,
    apiKey,
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
