'use client'
import { Note } from "@/types/note/type";
import { motion } from "framer-motion";

export function NoteListCard({
  note,
  handleUid,
}: {
  note: Note
  handleUid: (uid: string) => void,
}) {
  const sortedNotes = note.page?.sort((a, b) => {
    const aDate = new Date(a.dateEnd || '');
    const bDate = new Date(b.dateEnd || '');
    return bDate.getTime() - aDate.getTime();
  });

  if (!sortedNotes || sortedNotes.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground text-sm">
        暂无笔记
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sortedNotes.map((page, index) => (
        <motion.div
          key={page.uid}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: index * 0.05,
            ease: "easeOut",
          }}
        >
          <div
            onClick={() => handleUid(page.uid || '')}
            className="group cursor-pointer
                       bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm
                       rounded-xl border border-border/40
                       hover:border-primary/30 hover:shadow-md
                       hover:-translate-y-0.5
                       transition-all duration-300"
          >
            <div className="p-5 sm:p-6">
              {/* 标题 */}
              <h3 className="text-lg font-semibold text-foreground mb-2.5
                             group-hover:text-primary transition-colors duration-300
                             leading-snug line-clamp-2">
                {page.title}
              </h3>

              {/* 标签 */}
              {page.pageTags && page.pageTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {page.pageTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full
                                 bg-primary/10 text-primary border border-primary/15"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 时间信息 */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground/70 pt-3
                              border-t border-border/30">
                {page.dateStart && (
                  <span>创建于 {page.dateStart}</span>
                )}
                {page.dateEnd && (
                  <span>更新于 {page.dateEnd}</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
