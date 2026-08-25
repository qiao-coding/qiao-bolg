"use client";

import { User } from "lucide-react";
import Image from "next/image";
import { ToolCallCard } from "./ToolCallCard";
import { useT } from "@/i18n/LocaleContext";
import type { ChatMessage } from "./types";

export function ChatMessageBubble({ msg }: { msg: ChatMessage }) {
  const t = useT();

  // Tool messages
  if (msg.role === "tool") {
    return <ToolCallCard msg={msg} />;
  }

  const isUser = msg.role === "user";

  return (
    <div
      className={`flex gap-2.5 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <User className="w-3.5 h-3.5" />
        </div>
      ) : (
        <div className="shrink-0 w-7 h-7 rounded-full overflow-hidden ring-1 ring-border/50">
          <Image
            src="/user_img/up.jpg"
            alt="qiaoqiao"
            width={28}
            height={28}
            className="object-cover"
          />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted/60 text-foreground rounded-tl-sm"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{msg.content}</p>
        ) : msg.content === "error" ? (
          <p className="text-destructive">{t("admin.ai.error")}</p>
        ) : msg.content === "authError" ? (
          <p className="text-destructive">{t("admin.ai.authError")}</p>
        ) : msg.content ? (
          <div
            className="prose prose-sm dark:prose-invert max-w-none
                       [&_pre]:text-xs [&_code]:text-xs [&_p]:my-1"
            dangerouslySetInnerHTML={{ __html: simpleMarkdown(msg.content) }}
          />
        ) : (
          <TypingIndicator />
        )}
      </div>
    </div>
  );
}

/** Streaming typing indicator — 3 pulsing dots */
function TypingIndicator() {
  return (
    <span className="flex gap-1 items-center h-5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}

/** Minimal markdown-to-HTML converter (bold, italic, code, lists, links) */
export function simpleMarkdown(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    // Unordered lists
    .replace(/^[*-] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Line breaks
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}
