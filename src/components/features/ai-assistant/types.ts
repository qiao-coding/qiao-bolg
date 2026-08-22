export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  toolCallId?: string;
  toolName?: string;
  isToolResult?: boolean;
}

export type SSEEvent =
  | { type: "text"; content: string }
  | { type: "tool_call"; id: string; name: string; args: Record<string, unknown> }
  | { type: "tool_result"; id: string; name: string; result: unknown }
  | { type: "error"; message: string }
  | { type: "done" };

export interface PendingToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  status: "executing" | "done" | "error";
  result?: unknown;
}

/** Human-readable labels for tool names (matches i18n ai_tools keys) */
export const TOOL_LABELS: Record<string, string> = {
  list_notes: "ai_tools.list_notes",
  get_note: "ai_tools.get_note",
  create_note: "ai_tools.create_note",
  update_note: "ai_tools.update_note",
  delete_note: "ai_tools.delete_note",
  create_note_page: "ai_tools.create_note_page",
  update_note_page: "ai_tools.update_note_page",
  delete_note_page: "ai_tools.delete_note_page",
  search_notes: "ai_tools.search_notes",
  get_blog_settings: "ai_tools.get_blog_settings",
  update_blog_settings: "ai_tools.update_blog_settings",
  list_friends: "ai_tools.list_friends",
  create_friend: "ai_tools.create_friend",
  update_friend: "ai_tools.update_friend",
  delete_friend: "ai_tools.delete_friend",
  get_about: "ai_tools.get_about",
  update_about: "ai_tools.update_about",
  list_miscellaneous: "ai_tools.list_miscellaneous",
  create_miscellaneous: "ai_tools.create_miscellaneous",
  update_miscellaneous: "ai_tools.update_miscellaneous",
  delete_miscellaneous: "ai_tools.delete_miscellaneous",
};
