import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import type { Executor } from "../lib/executor";

// ---------------------------------------------------------------------------
// Blog content tools: friends, about page, miscellaneous (used by /api/ai/agent)
// ---------------------------------------------------------------------------
export const contentTools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "list_friends",
      description: "List all friend links (name, url, avatar, bio, status)",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "create_friend",
      description: "Add a new friend link",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Friend display name" },
          url: { type: "string", description: "Friend site URL" },
          avatar: { type: "string", description: "Optional avatar image URL" },
          bio: { type: "string", description: "Optional one-line bio" },
          status: { type: "boolean", description: "Whether the link is active, default false" },
        },
        required: ["name", "url"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_friend",
      description: "Update an existing friend link. Pass only the fields to change.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "number", description: "Friend ID" },
          name: { type: "string" },
          url: { type: "string" },
          avatar: { type: "string" },
          bio: { type: "string" },
          status: { type: "boolean" },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delete_friend",
      description:
        "Delete a friend link by ID. Ask the user for explicit confirmation before calling.",
      parameters: {
        type: "object",
        properties: { id: { type: "number", description: "Friend ID to delete" } },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_about",
      description: "Get the about page content (description and details list)",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "update_about",
      description:
        "Update the about page. details is the complete list of {label, value} items (replaces existing).",
      parameters: {
        type: "object",
        properties: {
          description: { type: "string", description: "About page description" },
          details: {
            type: "array",
            description: "Complete details list (replaces existing)",
            items: {
              type: "object",
              properties: { label: { type: "string" }, value: { type: "string" } },
              required: ["label", "value"],
              additionalProperties: false,
            },
          },
        },
        required: ["description", "details"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_miscellaneous",
      description: "List all miscellaneous items (short statuses / quotes with dates)",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "create_miscellaneous",
      description: "Create a new miscellaneous item (a short status or quote)",
      parameters: {
        type: "object",
        properties: { content: { type: "string", description: "The item text" } },
        required: ["content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_miscellaneous",
      description: "Update an existing miscellaneous item",
      parameters: {
        type: "object",
        properties: {
          id: { type: "number", description: "Item ID" },
          content: { type: "string", description: "New text" },
        },
        required: ["id", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delete_miscellaneous",
      description:
        "Delete a miscellaneous item by ID. Ask the user for explicit confirmation before calling.",
      parameters: {
        type: "object",
        properties: { id: { type: "number", description: "Item ID to delete" } },
        required: ["id"],
      },
    },
  },
];

export const contentExecutors: Record<string, Executor> = {
  list_friends: async () => {
    return prisma.friend.findMany({ orderBy: { createdAt: "desc" } });
  },

  create_friend: async ({ name, url, avatar, bio, status }) => {
    return prisma.friend.create({
      data: {
        name: name as string,
        url: url as string,
        avatar: (avatar as string) || "",
        bio: (bio as string) || "",
        status: (status as boolean) || false,
      },
    });
  },

  update_friend: async ({ id, ...data }) => {
    const patch: Record<string, unknown> = {};
    for (const key of ["name", "url", "avatar", "bio", "status"] as const) {
      if (data[key] !== undefined) patch[key] = data[key];
    }
    return prisma.friend.update({ where: { id: id as number }, data: patch });
  },

  delete_friend: async ({ id }) => {
    return prisma.friend.delete({ where: { id: id as number } });
  },

  get_about: async () => {
    const aboutPage = await prisma.aboutPage.findUnique({
      where: { id: 1 },
      include: { details: { orderBy: { order: "asc" } } },
    });
    if (!aboutPage) return { description: "", details: [] };
    return {
      description: aboutPage.description,
      details: aboutPage.details.map((d) => ({ label: d.label, value: d.value })),
    };
  },

  update_about: async ({ description, details }) => {
    const existing = await prisma.aboutPage.findUnique({ where: { id: 1 } });
    const detailsData = (details as { label: string; value: string }[]).map((d, i) => ({
      label: d.label,
      value: d.value,
      order: i,
    }));
    const result = existing
      ? await prisma.aboutPage.update({
          where: { id: 1 },
          data: {
            description: description as string,
            details: { deleteMany: {}, create: detailsData },
          },
          include: { details: { orderBy: { order: "asc" } } },
        })
      : await prisma.aboutPage.create({
          data: {
            id: 1,
            description: description as string,
            details: { create: detailsData },
          },
          include: { details: { orderBy: { order: "asc" } } },
        });
    return {
      description: result.description,
      details: result.details.map((d) => ({ label: d.label, value: d.value })),
    };
  },

  list_miscellaneous: async () => {
    return prisma.miscellaneous.findMany({ orderBy: { date: "desc" } });
  },

  create_miscellaneous: async ({ content }) => {
    return prisma.miscellaneous.create({
      data: {
        content: content as string,
        date: new Date().toISOString().slice(0, 10),
      },
    });
  },

  update_miscellaneous: async ({ id, content }) => {
    return prisma.miscellaneous.update({
      where: { id: id as number },
      data: {
        content: content as string,
        date: new Date().toISOString().slice(0, 10),
      },
    });
  },

  delete_miscellaneous: async ({ id }) => {
    return prisma.miscellaneous.delete({ where: { id: id as number } });
  },
};
