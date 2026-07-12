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
};
