import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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
// Tool definitions
// ---------------------------------------------------------------------------
const TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "list_notes",
      description: "List all note categories with their page counts",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_note",
      description: "Get a single note category with all its pages",
      parameters: {
        type: "object",
        properties: { id: { type: "number", description: "The note category ID" } },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_note",
      description: "Create a new note category",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Title of the note category" },
          tags: { type: "array", items: { type: "string" }, description: "Tags for the category" },
          titlePicture: { type: "string", description: "Optional cover image URL" },
        },
        required: ["title", "tags"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_note",
      description: "Update a note category title",
      parameters: {
        type: "object",
        properties: {
          id: { type: "number", description: "The note category ID" },
          title: { type: "string", description: "New title" },
        },
        required: ["id", "title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delete_note",
      description: "Delete a note category (cascades to all its pages). Ask for confirmation before calling.",
      parameters: {
        type: "object",
        properties: { id: { type: "number", description: "The note category ID to delete" } },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_note_page",
      description: "Create a new page inside a note category",
      parameters: {
        type: "object",
        properties: {
          noteId: { type: "number", description: "Parent note category ID" },
          title: { type: "string", description: "Page title" },
          uid: { type: "string", description: "UUID for the page" },
          pageId: { type: "string", description: "Unique page ID string" },
          content: { type: "string", description: "Page content in markdown" },
          author: { type: "string", description: "Author name, default HaoWhite" },
          dateStart: { type: "string", description: "Start date" },
          dateEnd: { type: "string", description: "End date" },
          pageTags: { type: "array", items: { type: "string" }, description: "Page tags" },
        },
        required: ["noteId", "title", "uid", "pageId", "content", "dateEnd", "pageTags"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_note_page",
      description: "Update an existing page's content or metadata",
      parameters: {
        type: "object",
        properties: {
          id: { type: "number", description: "Page database ID" },
          noteId: { type: "number", description: "Parent note category ID" },
          title: { type: "string", description: "Updated page title" },
          content: { type: "string", description: "Updated markdown content" },
          pageTags: { type: "array", items: { type: "string" }, description: "Updated tags" },
          dateEnd: { type: "string", description: "Updated end date" },
        },
        required: ["id", "noteId", "title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delete_note_page",
      description: "Delete a page from a note category",
      parameters: {
        type: "object",
        properties: { pageId: { type: "string", description: "The pageId of the page to delete" } },
        required: ["pageId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_notes",
      description: "Search notes and pages by keyword in titles, tags, and content",
      parameters: {
        type: "object",
        properties: { query: { type: "string", description: "Search keyword" } },
        required: ["query"],
      },
    },
  },
];

// ---------------------------------------------------------------------------
// Tool executors
// ---------------------------------------------------------------------------
const EXECUTORS: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  list_notes: async () => {
    return prisma.note.findMany({
      include: { page: true },
      orderBy: { createdAt: "desc" },
    });
  },

  get_note: async ({ id }) => {
    return prisma.note.findUnique({
      where: { id: id as number },
      include: { page: { orderBy: { dateStart: "asc" } } },
    });
  },

  create_note: async ({ title, tags, titlePicture }) => {
    return prisma.note.create({
      data: {
        title: title as string,
        tags: tags as string[],
        ...(titlePicture ? { titlePicture: titlePicture as string } : {}),
      },
    });
  },

  update_note: async ({ id, title }) => {
    return prisma.note.update({
      where: { id: id as number },
      data: { title: title as string },
    });
  },

  delete_note: async ({ id }) => {
    return prisma.note.delete({ where: { id: id as number } });
  },

  create_note_page: async (args) => {
    const { noteId, ...pageData } = args;
    return prisma.note.update({
      where: { id: noteId as number },
      data: {
        page: {
          create: {
            title: pageData.title as string,
            uid: pageData.uid as string,
            pageId: pageData.pageId as string,
            content: pageData.content as string,
            author: (pageData.author as string) ?? "HaoWhite",
            dateStart: (pageData.dateStart as string) ?? new Date().toISOString().slice(0, 10),
            dateEnd: pageData.dateEnd as string,
            pageTags: pageData.pageTags as string[],
          },
        },
      },
      include: { page: true },
    });
  },

  update_note_page: async ({ id, noteId, ...data }) => {
    return prisma.note.update({
      where: { id: noteId as number },
      data: {
        page: {
          update: {
            where: { id: id as number },
            data: {
              ...(data.title !== undefined ? { title: data.title as string } : {}),
              ...(data.content !== undefined ? { content: data.content as string } : {}),
              ...(data.pageTags !== undefined ? { pageTags: data.pageTags as string[] } : {}),
              ...(data.dateEnd !== undefined ? { dateEnd: data.dateEnd as string } : {}),
            },
          },
        },
      },
      include: { page: true },
    });
  },

  delete_note_page: async ({ pageId }) => {
    return prisma.notesPage.delete({ where: { pageId: pageId as string } });
  },

  search_notes: async ({ query }) => {
    const q = query as string;
    const [notes, pages] = await Promise.all([
      prisma.note.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { tags: { hasSome: [q] } },
          ],
        },
        include: { page: true },
      }),
      prisma.notesPage.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { content: { contains: q } },
            { pageTags: { hasSome: [q] } },
          ],
        },
        include: { note: true },
      }),
    ]);
    return { notes, pages };
  },
};

// ---------------------------------------------------------------------------
// Type guard for standard tool calls
// ---------------------------------------------------------------------------
function isStandardToolCall(
  tc: OpenAI.Chat.Completions.ChatCompletionMessageToolCall
): tc is OpenAI.Chat.Completions.ChatCompletionMessageToolCall & { function: { name: string; arguments: string } } {
  return tc.type === "function" && "function" in tc;
}

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

  // --- Create OpenAI client (DeepSeek) ---
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });

  // --- SSE stream ---
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const emit = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        const conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m) => {
            if (m.role === "tool") {
              return {
                role: "tool" as const,
                tool_call_id: "",
                content: m.content,
              };
            }
            return {
              role: m.role as "user" | "assistant",
              content: m.content,
            };
          }),
        ];

        let maxRounds = 5;

        while (maxRounds-- > 0) {
          const completion = await client.chat.completions.create({
            model: "deepseek-v4-flash",
            messages: conversation,
            tools: TOOLS,
          });

          const choice = completion.choices[0];
          const msg = choice.message;

          // Emit text content
          if (msg.content) {
            emit({ type: "text", content: msg.content });
          }

          // Handle tool calls
          if (msg.tool_calls && msg.tool_calls.length > 0) {
            const fnCalls = msg.tool_calls.filter(isStandardToolCall);

            if (fnCalls.length === 0) {
              break;
            }

            // Append assistant message with tool calls
            conversation.push({
              role: "assistant",
              content: msg.content,
              tool_calls: fnCalls.map((tc) => ({
                id: tc.id,
                type: "function" as const,
                function: {
                  name: tc.function.name,
                  arguments: tc.function.arguments,
                },
              })),
            });

            // Execute each tool call
            for (const tc of fnCalls) {
              const toolName = tc.function.name;
              let args: Record<string, unknown>;
              try {
                args = JSON.parse(tc.function.arguments);
              } catch {
                args = {};
              }

              emit({ type: "tool_call", id: tc.id, name: toolName, args });

              try {
                const executor = EXECUTORS[toolName];
                if (!executor) throw new Error(`Unknown tool: ${toolName}`);
                const result = await executor(args);
                emit({ type: "tool_result", id: tc.id, name: toolName, result });
                conversation.push({
                  role: "tool",
                  tool_call_id: tc.id,
                  content: JSON.stringify(result),
                });
              } catch (err) {
                const errMsg = err instanceof Error ? err.message : String(err);
                emit({ type: "tool_result", id: tc.id, name: toolName, result: { error: errMsg } });
                conversation.push({
                  role: "tool",
                  tool_call_id: tc.id,
                  content: JSON.stringify({ error: errMsg }),
                });
              }
            }

            // Continue loop to let the model respond to tool results
            continue;
          }

          // No tool calls — done
          break;
        }

        emit({ type: "done" });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        emit({ type: "error", message: msg });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
