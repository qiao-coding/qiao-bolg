"use client";

import { useEffect } from "react";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@/components/ui/shadcnComponents/message-scroller";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { useT } from "@/i18n/LocaleContext";
import type { ChatMessage } from "./types";

export function ChatMessages({
  messages,
  isStreaming,
  welcomeKey,
}: {
  messages: ChatMessage[];
  isStreaming: boolean;
  welcomeKey?: string;
}) {
  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <ChatMessagesInner
        messages={messages}
        isStreaming={isStreaming}
        welcomeKey={welcomeKey}
      />
    </MessageScrollerProvider>
  );
}

/**
 * Rendered inside MessageScrollerProvider so it can use the scroller hooks.
 * The scroller fills its parent — place it inside a height-constrained flex
 * column (the admin card / FAB sheet both do).
 */
function ChatMessagesInner({
  messages,
  isStreaming,
  welcomeKey,
}: {
  messages: ChatMessage[];
  isStreaming: boolean;
  welcomeKey?: string;
}) {
  const t = useT();
  const { scrollToEnd } = useMessageScroller();

  // Jump to the latest message whenever a new one is appended.
  // During streaming, MessageScrollerProvider's autoScroll follows the live edge.
  useEffect(() => {
    scrollToEnd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  return (
    <MessageScroller className="flex-1 min-h-0 px-4 py-4">
      <MessageScrollerViewport>
        <MessageScrollerContent className="gap-0" aria-busy={isStreaming}>
          {messages.length === 0 ? (
            <MessageScrollerItem messageId="welcome" scrollAnchor>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap px-1">
                {t(welcomeKey ?? "admin.ai.welcome")}
              </div>
            </MessageScrollerItem>
          ) : (
            messages.map((msg) => (
              <MessageScrollerItem
                key={msg.id}
                messageId={msg.id}
                scrollAnchor={msg.role === "user"}
              >
                <ChatMessageBubble msg={msg} />
              </MessageScrollerItem>
            ))
          )}
        </MessageScrollerContent>
      </MessageScrollerViewport>
      <MessageScrollerButton />
    </MessageScroller>
  );
}
