"use client";

import { useState, useCallback } from "react";
import { Search, Loader2, Link2 } from "lucide-react";
import { useT } from "@/i18n/LocaleContext";

type QueryResult = {
  answer: string;
  sources: { title: string; href: string; excerpt: string }[];
};

/**
 * Public, read-only lookup box on the homepage.
 * Sends a natural-language question to /api/agent/query (RAG over notes).
 */
export function AgentQueryBox() {
  const t = useT();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = useCallback(async () => {
    const q = question.trim();
    if (!q || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/agent/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setResult(data as QueryResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [question, loading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="mt-8 w-full max-w-xl mx-auto">
      {/* Input row */}
      <div className="flex items-center gap-2 rounded-full border border-brand-pink/25 bg-white/80 p-1.5 pl-4 shadow-[0_12px_40px_rgba(255,132,189,0.12)] backdrop-blur-md dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10">
        <Search className="h-4 w-4 shrink-0 text-brand-blue" />
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("home.askPlaceholder")}
          disabled={loading}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50"
        />
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className="shrink-0 rounded-full bg-brand-grad px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(255,143,199,0.28)] transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("home.asking")}
            </span>
          ) : (
            t("home.askSearch")
          )}
        </button>
      </div>

      <p className="mt-2 text-center text-xs text-muted-foreground/60">
        {t("home.askAssistant")}
      </p>

      {/* Result area */}
      {loading && (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-background/70 px-4 py-3 text-sm text-muted-foreground backdrop-blur-sm">
          <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
          {t("home.asking")}
        </div>
      )}

      {!loading && result && (
        <div className="mt-4 rounded-2xl border border-brand-pink/20 bg-background/80 px-4 py-4 text-left shadow-[0_12px_40px_rgba(255,132,189,0.08)] backdrop-blur-md dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/60">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {result.answer}
          </p>
          {result.sources.length > 0 && (
            <div className="mt-3 space-y-1.5 border-t border-border/50 pt-3">
              <p className="text-xs font-medium text-muted-foreground">
                {t("home.askSources")}
              </p>
              {result.sources.map((s, i) => (
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
      )}

      {!loading && error && (
        <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {t("home.askError")}: {error}
        </div>
      )}
    </div>
  );
}
