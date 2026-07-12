"use client";

import { motion, AnimatePresence } from "motion/react";
import { Check, Loader2, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useT } from "@/i18n/LocaleContext";
import type { ChatMessage } from "./types";

export function ToolCallCard({ msg }: { msg: ChatMessage }) {
  const t = useT();
  const [expanded, setExpanded] = useState(false);

  const toolLabel = msg.toolName
    ? t(`ai_tools.${msg.toolName}` as never) || msg.toolName
    : "Tool";
  const isDone = msg.isToolResult === true;
  const hasError = isDone && msg.content.includes('"error"');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="flex items-start gap-2 px-3 py-2 my-1 rounded-lg
                 bg-muted/50 border border-border/50 text-xs"
    >
      {/* Status icon */}
      <span className="shrink-0 mt-0.5">
        {!isDone ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
        ) : hasError ? (
          <X className="w-3.5 h-3.5 text-destructive" />
        ) : (
          <Check className="w-3.5 h-3.5 text-emerald-500" />
        )}
      </span>

      {/* Label + expand toggle */}
      <div className="flex-1 min-w-0">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors w-full text-left"
        >
          <span>
            {!isDone
              ? t("admin.ai.executing", { tool: toolLabel })
              : hasError
                ? t("admin.ai.toolFailed", { tool: toolLabel })
                : t("admin.ai.toolDone", { tool: toolLabel })}
          </span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-3 h-3" />
          </motion.span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.pre
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-1.5 text-[11px] text-muted-foreground/70 overflow-x-auto
                         bg-background/50 rounded p-1.5 max-h-32 overflow-y-auto"
            >
              {formatToolContent(msg.content)}
            </motion.pre>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function formatToolContent(content: string): string {
  try {
    return JSON.stringify(JSON.parse(content), null, 2);
  } catch {
    return content.length > 200 ? content.slice(0, 200) + "..." : content;
  }
}
