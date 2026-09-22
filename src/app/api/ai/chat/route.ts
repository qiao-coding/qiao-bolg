import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { noteTools, noteExecutors } from "../tools/notes";
import { runAgent } from "../lib/runAgent";
import { buildSystemPrompt } from "../lib/persona";

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are an AI assistant for a personal blog admin panel. Your primary job is to help the user manage their notes.

You have access to tools that let you:
- List all note categories (with page counts)
- Get details of a single note category (with all its pages)
- Create a new note category
- Update a note category's title
- Delete a note category (cascades to its pages — warn the user before deleting)
- Create a new page inside a note category
- Update an existing page's content or metadata
- Delete a page from a note category
- Search notes and pages by keyword

Guidelines:
- When listing notes, present the results clearly with title, tag, and page count.
- When the user asks to "create" or "add" something, confirm what was created.
- When the user asks to "delete" something, ask for confirmation before proceeding.
- When searching, tell the user how many results were found.
- If a tool call fails, explain the error to the user in plain language.
- Keep responses concise and in the same language the user is using (Chinese or English).
- If the user asks for something unrelated to note management, politely redirect them to note management tasks.`;

// ---------------------------------------------------------------------------
// POST handler
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
    systemPrompt: await buildSystemPrompt(SYSTEM_PROMPT),
    messages,
    tools: noteTools,
    executors: noteExecutors,
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
