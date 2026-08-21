"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ChatMessage, SSEEvent } from "./types";
import { getApiKey } from "@/lib/ai/apiKey";

const MAX_MESSAGES = 50;

function loadHistory(storageKey: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(-MAX_MESSAGES) : [];
  } catch {
    return [];
  }
}

function saveHistory(storageKey: string, messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(messages.slice(-MAX_MESSAGES)));
  } catch {
    // localStorage full or unavailable
  }
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useAIChat(opts?: { endpoint?: string; storageKey?: string }) {
  const endpoint = opts?.endpoint ?? "/api/ai/chat";
  const storageKey = opts?.storageKey ?? "ai_chat_history";

  const [messages, setMessages] = useState<ChatMessage[]>(() => loadHistory(storageKey));
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Persist on change
  useEffect(() => {
    saveHistory(storageKey, messages);
  }, [messages, storageKey]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: ChatMessage = {
        id: genId(),
        role: "user",
        content: text.trim(),
      };

      const assistantMsg: ChatMessage = {
        id: genId(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const allMessages = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const headers: Record<string, string> = { "Content-Type": "application/json" };
        const apiKey = getApiKey();
        if (apiKey) headers["x-api-key"] = apiKey;

        const res = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({ messages: allMessages }),
          signal: controller.signal,
        });

        if (res.status === 401 || res.status === 403) {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: "authError" } : m))
          );
          setIsStreaming(false);
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6);
            try {
              const event: SSEEvent = JSON.parse(jsonStr);
              handleSSEEvent(event, assistantMsg.id, setMessages);
            } catch {
              // skip malformed events
            }
          }
        }

        // Process remaining buffer
        if (buffer.startsWith("data: ")) {
          try {
            const event: SSEEvent = JSON.parse(buffer.slice(6));
            handleSSEEvent(event, assistantMsg.id, setMessages);
          } catch {
            // skip
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, content: m.content || "error" } : m
          )
        );
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, isStreaming, endpoint, storageKey]
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const cancelStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { messages, isStreaming, sendMessage, clearHistory, cancelStreaming };
}

// ---------------------------------------------------------------------------
// SSE event handler (mutates state via setter)
// ---------------------------------------------------------------------------
function handleSSEEvent(
  event: SSEEvent,
  assistantId: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) {
  switch (event.type) {
    case "text":
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: m.content + event.content } : m
        )
      );
      break;

    case "tool_call":
      setMessages((prev) => [
        ...prev,
        {
          id: event.id,
          role: "tool",
          content: JSON.stringify(event.args),
          toolCallId: event.id,
          toolName: event.name,
        },
      ]);
      break;

    case "tool_result":
      setMessages((prev) =>
        prev.map((m) =>
          m.toolCallId === event.id
            ? { ...m, isToolResult: true, content: JSON.stringify(event.result) }
            : m
        )
      );
      break;

    case "error":
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId && !m.content ? { ...m, content: "error" } : m))
      );
      break;

    case "done":
      // stream complete — nothing extra needed
      break;
  }
}
