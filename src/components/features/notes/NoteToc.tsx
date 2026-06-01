"use client";

import type { TocItem } from "@/lib/docs/toc";
import { useActiveHeading } from "@/lib/use-active-heading";
import { cn } from "@/lib/utils";

export function NoteToc({ items }: { items: TocItem[] }) {
  const headingIds = items.map((item) => item.id);
  const activeId = useActiveHeading(headingIds);

  if (items.length === 0) return null;

  return (
    <nav className="min-w-0 max-w-full text-xs" aria-label="本页目录">
      <p className="text-foreground mb-4 text-[11px] font-semibold tracking-wider uppercase">
        本页目录
      </p>
      <ul className="text-muted-foreground space-y-0.5 border-l border-border/50 pl-2">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={cn(
                "relative rounded-sm transition-colors duration-200",
                item.level === 3 && "pl-4",
                "min-h-[28px] flex items-center"
              )}
            >
              <a
                href={`#${item.id}`}
                className={cn(
                  "block min-w-0 max-w-full break-words rounded-md px-2 py-1.5 transition-colors duration-200 [overflow-wrap:anywhere]",
                  isActive
                    ? "bg-primary/5 text-primary font-medium shadow-sm border border-primary/20"
                    : "hover:bg-accent/30 hover:text-foreground"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                    window.history.pushState(null, "", `#${item.id}`);
                  }
                }}
              >
                {isActive && (
                  <span className="absolute -left-[9px] top-1/2 h-2 w-[2px] -translate-y-1/2 rounded-full bg-primary transition-opacity duration-200" />
                )}
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
