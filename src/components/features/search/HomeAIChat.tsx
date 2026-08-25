"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUp, BookOpen, Link2, MessageCircle, Minus, Search, X } from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import { useT } from "@/i18n/LocaleContext";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/shadcnComponents/message-scroller";
import { ChatMarkdown } from "./ChatMarkdown";

type Source = { title: string; href: string; excerpt: string };

type HomeMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  toolCalls?: { name: string }[];
  isError?: boolean;
};

type ChatStreamEvent =
  | { type: "text"; content: string }
  | { type: "sources"; sources: Source[] }
  | { type: "tool_call"; name: string; input?: unknown }
  | { type: "error"; error: string }
  | { type: "done" };

type NoteContext = {
  title: string;
  category: string;
  href: string;
  tags: string[];
  content: string;
};

let uid = 0;
const nextId = () => `${Date.now()}-${uid++}`;

/**
 * 主页右下角悬浮 AI 聊天窗（公开只读 RAG）。
 * 布局参考 XiaoyunFocusSider：固定定位、可开关、AI 头像 + markdown、
 * textarea + 圆形发送按钮；消息区用 shadcn message-scroller。
 */
export function HomeAIChat() {
  const t = useT();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState<HomeMsg[]>([]);
  const [noteContext, setNoteContext] = useState<NoteContext | null>(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const readContext = () => {
      setNoteContext(window.__BLOG_NOTE_CONTEXT__ ?? null);
    };

    readContext();
    window.addEventListener("blog-note-context", readContext);
    return () => window.removeEventListener("blog-note-context", readContext);
  }, [pathname]);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || loading) return;
      const history = conversation
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));
      const assistantId = nextId();
      setConversation((c) => [
        ...c,
        { id: nextId(), role: "user", content: q },
        { id: assistantId, role: "assistant", content: "" },
      ]);
      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      setLoading(true);
      try {
        const res = await fetch("/api/agent/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q, history, noteContext }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || `HTTP ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const raw of events) {
            const line = raw.split("\n").find((part) => part.startsWith("data: "));
            if (!line) continue;
            handleStreamEvent(line.slice(6), assistantId, setConversation);
          }
        }

        if (buffer.startsWith("data: ")) {
          handleStreamEvent(buffer.slice(6), assistantId, setConversation);
        }
      } catch (err) {
        setConversation((c) =>
          c.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: err instanceof Error ? err.message : String(err),
                  isError: true,
                }
              : m
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [loading, conversation, noteContext]
  );

  const handleSend = () => {
    if (!input.trim() || loading) return;
    send(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 100) + "px";
  };

  return (
    <section className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5">
      {!open ? (
        /* 悬浮入口：小小乔头像按钮 */
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("home.chatTitle")}
          className="group relative cursor-pointer"
        >
          <span className="absolute -inset-1 rounded-full bg-brand-pink/30 blur-lg transition-opacity group-hover:opacity-70 dark:bg-[#8fb7df]/28" />
          <Image
            src="/user_img/up.jpg"
            alt={t("home.chatTitle")}
            width={56}
            height={56}
            className="size-14 rounded-full border-2 border-white object-cover shadow-[0_12px_30px_rgba(255,132,189,0.35)] transition-transform group-hover:scale-105 dark:border-[#8fb7df]/40 dark:shadow-[0_12px_30px_rgba(10,18,34,0.4)]"
          />
          <span className="absolute -bottom-1 -left-1 flex size-7 items-center justify-center rounded-full border border-white bg-card text-brand-pink-deep shadow-sm dark:border-[#8fb7df]/30 dark:text-[#dbe9f8]">
            <MessageCircle className="size-3.5" />
          </span>
          <span className="absolute -right-0.5 -top-0.5 flex size-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-blue opacity-60" />
            <span className="relative inline-flex size-3.5 rounded-full border-2 border-white bg-brand-blue dark:border-[#202a3f]" />
          </span>
        </button>
      ) : (
        <div className="flex h-[min(620px,calc(100dvh-2rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[24px] border border-white/70 bg-card/94 shadow-[0_24px_70px_rgba(255,132,189,0.2)] backdrop-blur-md dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/94 dark:shadow-[0_24px_70px_rgba(10,18,34,0.38)] sm:w-[410px]">
          {/* Header */}
          <div className="shrink-0 border-b border-border/50 px-4 py-3">
            <div className="flex items-center gap-3">
              <Image
                src="/user_img/up.jpg"
                alt={t("home.chatTitle")}
                width={36}
                height={36}
                className="size-9 shrink-0 rounded-full object-cover ring-1 ring-border/50"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {t("home.chatTitle")}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {noteContext ? t("home.askCurrentNote") : t("home.askAssistant")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="minimize"
                className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Minus className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setConversation([]);
                  setOpen(false);
                }}
                aria-label="close"
                className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            {noteContext && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-brand-pink/15 bg-brand-pink-soft/40 px-3 py-2 text-xs text-brand-pink-deep dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]">
                <BookOpen className="size-3.5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">
                  {t("home.readingContext")}：{noteContext.title}
                </span>
              </div>
            )}
          </div>

          {/* Messages */}
          <ChatArea conversation={conversation} />

          {/* Input */}
          <div className="shrink-0 border-t border-border/50 bg-card/70 p-3">
            <div className="flex items-end gap-2 rounded-[18px] border border-border/60 bg-background/90 p-2 shadow-inner">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={noteContext ? t("home.askNotePlaceholder") : t("home.askPlaceholder")}
                rows={1}
                className="min-h-9 max-h-24 flex-1 resize-none overflow-y-auto border-0 bg-transparent px-2 py-2 text-sm leading-5 placeholder:text-muted-foreground/60 [scrollbar-width:none] focus:outline-none disabled:opacity-50 [&::-webkit-scrollbar]:hidden"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                aria-label={t("home.chatSend")}
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-grad text-white shadow-[0_10px_22px_rgba(255,143,199,0.28)] transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
              >
                <ArrowUp className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------------- */
/* 消息区：message-scroller + 气泡行                                          */
/* ------------------------------------------------------------------------- */

function ChatArea({ conversation }: { conversation: HomeMsg[] }) {
  const t = useT();
  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <MessageScroller className="min-h-0 flex-1">
        <MessageScrollerViewport>
          <MessageScrollerContent className="gap-3 px-3 py-4">
            {conversation.length === 0 ? (
              <MessageScrollerItem messageId="welcome" scrollAnchor>
                <div className="rounded-2xl border border-border/50 bg-muted/35 px-4 py-3 text-sm leading-7 text-muted-foreground">
                  {t("home.chatWelcome")}
                </div>
              </MessageScrollerItem>
            ) : (
              <>
                {conversation.map((m) => (
                  <MessageScrollerItem
                    key={m.id}
                    messageId={m.id}
                    scrollAnchor={m.role === "user"}
                  >
                    <MessageRow msg={m} />
                  </MessageScrollerItem>
                ))}
              </>
            )}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}

function MessageRow({ msg }: { msg: HomeMsg }) {
  const t = useT();
  const isUser = msg.role === "user";

  return (
    <div className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && (
        <Image
          src="/user_img/up.jpg"
          alt={t("home.chatTitle")}
          width={28}
          height={28}
          className="size-7 shrink-0 rounded-full object-cover ring-1 ring-border/50"
        />
      )}
      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-7 shadow-sm ${
          isUser
            ? "rounded-tr-md bg-foreground text-background"
            : "rounded-tl-md bg-brand-pink-soft/55 text-foreground dark:bg-[#b9d7f2]/10"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{msg.content}</p>
        ) : msg.isError ? (
          <p className="text-destructive">{msg.content}</p>
        ) : msg.content ? (
          <>
            <ChatMarkdown content={msg.content} />
            {msg.toolCalls && msg.toolCalls.length > 0 && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground/70">
                <Search className="size-3" />
                {t("home.askDone", { count: msg.toolCalls.length })}
              </p>
            )}
          </>
        ) : msg.toolCalls && msg.toolCalls.length > 0 ? (
          <ToolLooking />
        ) : (
          <TypingDots />
        )}
        {!isUser && !msg.isError && msg.sources && msg.sources.length > 0 && (
          <div className="mt-2 space-y-1 border-t border-border/50 pt-2">
            <p className="text-xs text-muted-foreground">{t("home.askSources")}</p>
            {msg.sources.map((s, i) => (
              <a
                key={`${s.href}-${i}`}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-brand-blue-deep hover:underline dark:text-[#dbe9f8]"
              >
                <Link2 className="h-3 w-3 shrink-0" />
                <span className="truncate">{s.title}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function handleStreamEvent(
  raw: string,
  assistantId: string,
  setConversation: React.Dispatch<React.SetStateAction<HomeMsg[]>>
) {
  try {
    const event = JSON.parse(raw) as ChatStreamEvent;
    if (event.type === "text") {
      setConversation((items) =>
        items.map((m) =>
          m.id === assistantId ? { ...m, content: m.content + event.content } : m
        )
      );
      return;
    }

    if (event.type === "sources") {
      setConversation((items) =>
        items.map((m) =>
          m.id === assistantId ? { ...m, sources: event.sources } : m
        )
      );
      return;
    }

    if (event.type === "tool_call") {
      setConversation((items) =>
        items.map((m) =>
          m.id === assistantId
            ? { ...m, toolCalls: [...(m.toolCalls ?? []), { name: event.name }] }
            : m
        )
      );
      return;
    }

    if (event.type === "error") {
      setConversation((items) =>
        items.map((m) =>
          m.id === assistantId ? { ...m, content: event.error, isError: true } : m
        )
      );
    }
  } catch {
    // Skip malformed stream chunks.
  }
}

function TypingDots() {
  return (
    <span className="flex h-5 items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}

/** 模型正在调用工具（查阅笔记）时的进行中指示。 */
function ToolLooking() {
  const t = useT();
  return (
    <span className="flex items-center gap-2 text-xs text-muted-foreground/70">
      <span className="flex h-4 items-center gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground/40"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </span>
      {t("home.asking")}
    </span>
  );
}
