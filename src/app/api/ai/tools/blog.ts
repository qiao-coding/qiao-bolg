import OpenAI from "openai";
import { getBlogSettings, upsertBlogSettings, type BlogSettingsInput } from "@/lib/blog/blogSettings";
import type { Executor } from "../lib/executor";

// ---------------------------------------------------------------------------
// Blog settings tools (used by /api/ai/agent)
// ---------------------------------------------------------------------------
export const blogTools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_blog_settings",
      description: "Get the current blog settings (name, home page title/subtitle, home icons, notes sidebar name/email/social links)",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "update_blog_settings",
      description:
        "Update blog settings. Pass only the fields to change. homeIcons replaces the whole icon list (id, name, link). homePage fields: mainTitle, subTitle, isDynamicTitle, isDynamicTiltCard. notesSidebar fields: name, email, isDynamicEmail, isDynamicName, socialLinks (replaces whole list: name, link).",
      parameters: {
        type: "object",
        properties: {
          blogName: { type: "string", description: "Blog name" },
          homePage: {
            type: "object",
            description: "Home page hero settings",
            properties: {
              mainTitle: { type: "string" },
              subTitle: { type: "string" },
              isDynamicTitle: { type: "boolean" },
              isDynamicTiltCard: { type: "boolean" },
            },
            additionalProperties: false,
          },
          homeIcons: {
            type: "array",
            description: "Complete home icon list (replaces existing)",
            items: {
              type: "object",
              properties: { name: { type: "string" }, link: { type: "string" } },
              required: ["name", "link"],
              additionalProperties: false,
            },
          },
          notesSidebar: {
            type: "object",
            description: "Notes sidebar settings",
            properties: {
              name: { type: "string" },
              email: { type: "string" },
              isDynamicEmail: { type: "boolean" },
              isDynamicName: { type: "boolean" },
              socialLinks: {
                type: "array",
                items: {
                  type: "object",
                  properties: { name: { type: "string" }, link: { type: "string" } },
                  required: ["name", "link"],
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
];

export const blogExecutors: Record<string, Executor> = {
  get_blog_settings: async () => {
    return getBlogSettings();
  },

  update_blog_settings: async (args) => {
    return upsertBlogSettings(args as BlogSettingsInput);
  },
};
