"use client";

import { useState } from "react";
import { KeyRound, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/shadcnComponents/overlay/dialog";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { useT } from "@/i18n/LocaleContext";
import { getApiKey, setApiKey } from "@/lib/ai/apiKey";

/**
 * API Key settings dialog. Stored in localStorage and sent as `x-api-key`
 * to /api/ai/agent (falls back to the server env key when empty).
 */
export function ApiKeyDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useT();
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);

  // Load current key when the dialog opens
  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (next) {
      setValue(getApiKey());
      setSaved(false);
    }
  };

  const handleSave = () => {
    setApiKey(value.trim());
    setSaved(true);
    setTimeout(() => onOpenChange(false), 600);
  };

  const handleClear = () => {
    setApiKey("");
    setValue("");
    setSaved(true);
    setTimeout(() => onOpenChange(false), 400);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-[28px] border border-white/70 bg-card/72 shadow-[0_24px_70px_rgba(255,132,189,0.14)] backdrop-blur-md dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/74 dark:shadow-[0_24px_70px_rgba(10,18,34,0.28)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-brand-blue" />
            {t("admin.apiKey.title")}
          </DialogTitle>
          <DialogDescription>{t("admin.apiKey.desc")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t("admin.apiKey.placeholder")}
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          <p className="text-[11px] text-muted-foreground/60">
            {t("admin.apiKey.hint")}
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          {saved ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500">
              <Check className="h-4 w-4" />
              {t("admin.apiKey.saved")}
            </span>
          ) : null}
          <DialogClose asChild>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              {t("admin.apiKey.clear")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="ghost" size="sm">
              {t("admin.apiKey.cancel")}
            </Button>
          </DialogClose>
          <Button size="sm" className="rounded-full bg-brand-grad text-white" onClick={handleSave}>
            {t("admin.apiKey.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
