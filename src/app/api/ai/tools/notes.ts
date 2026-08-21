import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import type { Executor } from "../lib/executor";

// ---------------------------------------------------------------------------
// Note management tools (shared by /api/ai/chat and /api/ai/agent)
// ---------------------------------------------------------------------------
export const noteTools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
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
      description:
        "Delete a note category (cascades to all its pages). Ask the user for explicit confirmation before calling.",
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
          author: { type: "string", description: "Author name, default xiaoxiaoqiao" },
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
      description:
        "Delete a page from a note category. Ask the user for explicit confirmation before calling.",
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

export const noteExecutors: Record<string, Executor> = {
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
            author: (pageData.author as string) ?? "xiaoxiaoqiao",
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
