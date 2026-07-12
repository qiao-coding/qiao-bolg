"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/shadcnComponents/overlay/sheet";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { Trash2 } from "lucide-react";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { useT } from "@/i18n/LocaleContext";
import type { ChatMessage } from "./types";

interface AIAssistantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: ChatMessage[];
  isStreaming: boolean;
  onSend: (text: string) => void;
  onClear: () => void;
}

export function AIAssistantSheet({
  open,
  onOpenChange,
  messages,
  isStreaming,
  onSend,
  onClear,
}: AIAssistantSheetProps) {
  const t = useT();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-md md:w-[440px] w-full flex flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="px-4 py-3 border-b border-border/60 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-sm font-semibold">
                {t("admin.ai.assistant")}
              </SheetTitle>
              <SheetDescription className="text-xs">
                {t("admin.ai.assistantDesc")}
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClear}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              aria-label={t("admin.ai.clearChat")}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Messages */}
        <ChatMessages messages={messages} isStreaming={isStreaming} />

        {/* Input */}
        <ChatInput onSend={onSend} isStreaming={isStreaming} />
      </SheetContent>
    </Sheet>
  );
}
