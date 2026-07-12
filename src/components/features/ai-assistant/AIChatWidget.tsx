"use client";

import { useState } from "react";
import { AIAssistantFAB } from "./AIAssistantFAB";
import { AIAssistantSheet } from "./AIAssistantSheet";
import { useAIChat } from "./useAIChat";

/**
 * Composes FAB + Sheet + useAIChat hook.
 * Mount this once inside the admin layout.
 */
export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const { messages, isStreaming, sendMessage, clearHistory } = useAIChat();

  return (
    <>
      <AIAssistantFAB onClick={() => setOpen(true)} />
      <AIAssistantSheet
        open={open}
        onOpenChange={setOpen}
        messages={messages}
        isStreaming={isStreaming}
        onSend={sendMessage}
        onClear={clearHistory}
      />
    </>
  );
}
