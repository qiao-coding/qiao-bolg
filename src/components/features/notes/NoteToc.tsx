"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/docs/toc";
import { useActiveHeading } from "@/lib/use-active-heading";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

/** 阅读进度条 */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(100, Math.round((scrollTop / docHeight) * 100)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-foreground/70">
          本页目录
        </span>
        <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
          {progress}%
        </span>
      </div>
      <div className="h-[2px] w-full rounded-full bg-border/50 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-brand-pink dark:bg-[#b9d7f2]"
          style={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}

export function NoteToc({ items, instanceId = "toc" }: { items: TocItem[]; instanceId?: string }) {
  const headingIds = items.map((item) => item.id);
  const activeId = useActiveHeading(headingIds);

  if (items.length === 0) return null;

  return (
    <nav className="min-w-0 max-w-full text-xs" aria-label="本页目录">
      <ReadingProgress />

      <ul className="relative text-muted-foreground space-y-0">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={cn(
                "relative",
                item.level === 3 && "pl-4"
              )}
            >
              <motion.a
                href={`#${item.id}`}
                className={cn(
                  "relative flex items-center min-h-[30px] px-2.5 py-1.5 rounded-lg",
                  "text-[13px] leading-snug transition-colors duration-200",
                  "[overflow-wrap:anywhere]",
                  isActive
                    ? "text-brand-pink-deep font-medium dark:text-[#dbe9f8]"
                    : "hover:text-foreground hover:bg-accent/40"
                )}
                whileHover={{ x: isActive ? 0 : 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                    window.history.pushState(null, "", `#${item.id}`);
                  }
                }}
              >
                {/* 活动项背景 */}
                {isActive && (
                  <motion.span
                    layoutId={`${instanceId}-active`}
                    className="absolute inset-0 rounded-lg border border-brand-pink/25 bg-brand-pink-soft/55 dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10"
                    transition={{ type: "spring", stiffness: 700, damping: 32 }}
                  >
                    <span className="absolute -left-[1px] top-1/2 -translate-y-1/2
                                     w-1.5 h-1.5 rounded-full
                                     bg-brand-pink dark:bg-[#b9d7f2]" />
                  </motion.span>
                )}

                {/* 标题文字 */}
                <span className="relative z-10">{item.title}</span>
              </motion.a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
