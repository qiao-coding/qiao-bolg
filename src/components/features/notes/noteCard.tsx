"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { Note } from "@/types/note/type";
import { BookOpen, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";

const NotesCard = ({ note, index }: { note: Note; index: number }) => {
  const router = useRouter();
  const pathname = usePathname();
  const pendingRefreshPath = useRef<string | null>(null);
  const { id, title, tags, titlePicture, page, createdAt } = note;
  const pageCount = page?.length ?? 0;

  useEffect(() => {
    if (
      pendingRefreshPath.current &&
      (pathname === pendingRefreshPath.current || pathname.endsWith(pendingRefreshPath.current))
    ) {
      pendingRefreshPath.current = null;
      router.refresh();
    }
  }, [pathname, router]);

  const handleClick = (notesID: number) => {
    const targetPath = `/notes/${notesID}`;
    pendingRefreshPath.current = targetPath;
    router.push(targetPath);
  };

  const dateStr = createdAt
    ? new Date(createdAt).toLocaleDateString("zh-CN")
    : null;

  return (
    <article
      onClick={() => handleClick(Number(id))}
      className="group flex cursor-pointer items-center gap-5 px-2 py-4 transition-colors duration-200 hover:bg-white/55 dark:hover:bg-[#26334d]"
      role="listitem"
    >
      {/* 序号 */}
      <span className="hidden w-10 shrink-0 text-center font-mono text-sm text-muted-foreground sm:block">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* 封面缩略图 */}
      {titlePicture ? (
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-brand-pink/15 bg-white transition-colors group-hover:border-brand-pink/35 dark:border-[#8fb7df]/24 dark:bg-[#26334d]">
          <Image
            fill
            src={titlePicture}
            alt={title}
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="64px"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-brand-pink/15 bg-brand-pink-soft/45 transition-colors group-hover:border-brand-pink/35 dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
        </div>
      )}

      {/* 主体信息 */}
      <div className="flex-1 min-w-0">
        <h3 className="line-clamp-1 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-brand-pink-deep">
          {title}
        </h3>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {/* 标签 */}
          {tags && tags.length > 0 && (
            <span className="flex gap-1">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="whitespace-nowrap rounded-md border border-brand-pink/15 bg-brand-pink-soft/45 px-2 py-0.5 text-[10px] text-brand-pink-deep dark:border-[#8fb7df]/20 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]"
                >
                  {tag}
                </span>
              ))}
            </span>
          )}
          {/* 日期 */}
          {dateStr && (
            <span className="text-xs text-muted-foreground font-mono">
              {dateStr}
            </span>
          )}
        </div>
      </div>

      {/* 右侧：篇数 + 箭头 */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="rounded-md bg-white/55 px-2 py-0.5 text-xs tabular-nums text-muted-foreground dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]">
          {pageCount} 篇
        </span>
        <ChevronRight className="size-5 text-muted-foreground/45 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand-pink-deep" />
      </div>
    </article>
  );
};

export default NotesCard;
