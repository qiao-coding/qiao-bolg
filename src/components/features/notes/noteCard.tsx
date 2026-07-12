"use client";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { Note } from "@/types/note/type";
import { BookOpen } from "lucide-react";

const NotesCard = ({ note, index }: { note: Note; index: number }) => {
  const router = useRouter();
  const { id, title, tags, titlePicture, page, createdAt } = note;
  const pageCount = page?.length ?? 0;

  const handleClick = (notesID: number) => {
    router.push(`/notes/${notesID}`);
  };

  const dateStr = createdAt
    ? new Date(createdAt).toLocaleDateString("zh-CN")
    : null;

  return (
    <article
      onClick={() => handleClick(Number(id))}
      className="flex items-center gap-5 px-2 py-3.5
                 border-b border-border/60 cursor-pointer
                 hover:bg-accent/20 transition-colors duration-200 group"
      role="listitem"
    >
      {/* 序号 */}
      <span className="w-8 text-right font-mono text-sm text-muted-foreground shrink-0 hidden sm:block">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* 封面缩略图 */}
      {titlePicture ? (
        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0
                        ring-1 ring-border/50 group-hover:ring-primary/30 transition-all">
          <Image
            fill
            src={titlePicture}
            alt={title}
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="56px"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0
                        ring-1 ring-border/50 group-hover:ring-primary/30 transition-all">
          <BookOpen className="w-5 h-5 text-muted-foreground" />
        </div>
      )}

      {/* 主体信息 */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-foreground leading-snug
                       group-hover:text-primary transition-colors line-clamp-1">
          {title}
        </h3>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {/* 标签 */}
          {tags && tags.length > 0 && (
            <span className="flex gap-1">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full
                             bg-primary/10 text-primary border border-primary/20
                             whitespace-nowrap"
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
        <span className="text-xs font-mono text-muted-foreground bg-muted/50
                         px-2 py-0.5 rounded-full tabular-nums">
          {pageCount} 篇
        </span>
        <span className="text-muted-foreground/40 text-lg leading-none
                         group-hover:text-primary group-hover:translate-x-0.5
                         transition-all duration-200">
          &rarr;
        </span>
      </div>
    </article>
  );
};

export default NotesCard;
