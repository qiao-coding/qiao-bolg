"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/shadcnComponents/navigation/scroll-area";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { useT } from "@/i18n/LocaleContext";
import type { ChatMessage } from "./types";

export function ChatMessages({
  messages,
  isStreaming,
}: {
  messages: ChatMessage[];
  isStreaming: boolean;
}) {
  const t = useT();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 px-4 py-4">
      {messages.length === 0 ? (
        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap px-1">
          {t("admin.ai.welcome")}
        </div>
      ) : (
        <div className="space-y-0">
          {messages.map((msg) => (
            <ChatMessageBubble key={msg.id} msg={msg} />
          ))}
        </div>
      )}
      <div ref={bottomRef} />
    </ScrollArea>
  );
}
