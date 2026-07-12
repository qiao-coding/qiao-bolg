"use client";

import { useState, useRef, useCallback } from "react";
import { Send, Loader2 } from "lucide-react";
import { useT } from "@/i18n/LocaleContext";

export function ChatInput({
  onSend,
  isStreaming,
}: {
  onSend: (text: string) => void;
  isStreaming: boolean;
}) {
  const t = useT();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    if (!value.trim() || isStreaming) return;
    onSend(value);
    setValue("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isStreaming, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  return (
    <div className="border-t border-border/60 p-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={t("admin.ai.placeholder")}
          disabled={isStreaming}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-border/60 bg-background
                     px-3 py-2 text-sm placeholder:text-muted-foreground/60
                     focus:outline-none focus:ring-1 focus:ring-primary/30
                     disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={isStreaming || !value.trim()}
          className="shrink-0 w-9 h-9 rounded-lg bg-primary text-primary-foreground
                     flex items-center justify-center
                     hover:bg-primary/90 disabled:opacity-40 transition-colors"
          aria-label={t("admin.ai.send")}
        >
          {isStreaming ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
        {t("admin.ai.poweredBy")}
      </p>
    </div>
  );
}
