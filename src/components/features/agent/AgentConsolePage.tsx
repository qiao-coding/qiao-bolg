"use client";

import { useT } from "@/i18n/LocaleContext";
import { Bot } from "lucide-react";
import { useAIChat } from "@/components/features/ai-assistant/useAIChat";
import { ChatMessages } from "@/components/features/ai-assistant/ChatMessages";
import { ChatInput } from "@/components/features/ai-assistant/ChatInput";

/**
 * Admin agent console — full tool-calling agent that can read/write
 * notes, blog settings, friend links, about page, and miscellaneous.
 */
export function AgentConsolePage() {
  const t = useT();
  const { messages, isStreaming, sendMessage, clearHistory } = useAIChat({
    endpoint: "/api/ai/agent",
    storageKey: "ai_agent_history",
  });

  return (
    <main className="mx-auto max-w-4xl px-4">
      <div className="flex flex-col h-[calc(100vh-12rem)] rounded-[28px] border border-white/70 bg-card/72 shadow-[0_24px_70px_rgba(255,132,189,0.14)] backdrop-blur-md dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/74 dark:shadow-[0_24px_70px_rgba(10,18,34,0.28)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-grad text-white shadow-[0_10px_22px_rgba(255,143,199,0.28)]">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-foreground">
              {t("admin.ai.agentTitle")}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {t("admin.ai.agentDesc")}
            </p>
          </div>
          <button
            onClick={clearHistory}
            className="shrink-0 rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("admin.ai.clearChat")}
          </button>
        </div>

        {/* Messages */}
        <ChatMessages
          messages={messages}
          isStreaming={isStreaming}
          welcomeKey="admin.ai.welcomeAgent"
        />

        {/* Input */}
        <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
      </div>
    </main>
  );
}
