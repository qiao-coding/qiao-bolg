"use client";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { Note } from "@/types/note/type";

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
      className="flex items-center gap-4 p-4
                 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm
                 rounded-xl border border-border/40
                 cursor-pointer
                 hover:bg-white/80 dark:hover:bg-slate-700/70
                 hover:border-primary/30 hover:shadow-md
                 hover:-translate-y-0.5
                 transition-all duration-300 group"
      role="listitem"
    >
      {/* 封面缩略图 */}
      {titlePicture ? (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0
                        ring-1 ring-border/30 group-hover:ring-primary/30 transition-all">
          <Image
            fill
            src={titlePicture}
            alt={title}
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="48px"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5
                        flex items-center justify-center shrink-0
                        ring-1 ring-border/30 group-hover:ring-primary/30 transition-all">
          <span className="text-primary/60 font-semibold text-sm">
            {title.charAt(0)}
          </span>
        </div>
      )}

      {/* 主体信息 */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-foreground leading-snug
                       group-hover:text-primary transition-colors line-clamp-1">
          {title}
        </h3>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {tags && tags.length > 0 && (
            <span className="flex gap-1">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full
                             bg-primary/10 text-primary border border-primary/15
                             whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </span>
          )}
          {dateStr && (
            <span className="text-xs text-muted-foreground/70">
              {dateStr}
            </span>
          )}
        </div>
      </div>

      {/* 右侧：篇数 */}
      <span className="text-xs text-muted-foreground bg-muted/40
                       px-2.5 py-1 rounded-full tabular-nums shrink-0
                       group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        {pageCount} 篇
      </span>
    </article>
  );
};

export default NotesCard;
