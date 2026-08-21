'use client'
import { Note } from "@/types/note/type";
import { useRef } from "react";

// NoteListCard 组件：用于展示笔记列表卡片
export function NoteListCard(
    {
        note,
        handleUid,

    }: {
        note: Note
        handleUid: (uid: string) => void,

    }
) {
    // 用于存储每个 section 的 DOM 引用
    const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

    // 用于存储每个卡片的 DOM 引用
    const cardRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});

    // 根据 dateEnd 倒序排序笔记
    const sort_notes = note.page && [...note.page].sort((a, b) => {
        const aDate = new Date(a.dateEnd || '');
        const bDate = new Date(b.dateEnd || '');
        return bDate.getTime() - aDate.getTime();
    });

    return (
        <div className="mx-auto w-full max-w-4xl divide-y divide-brand-pink/10 border-y border-brand-pink/10 bg-white/42 dark:divide-[#8fb7df]/16 dark:border-[#8fb7df]/18 dark:bg-[#202a3f]/72">
            {/* 遍历排序后的笔记列表 */}
            {sort_notes && sort_notes.map((note) => (
                <div
                    id={`section-${note.uid}`}
                    className="cursor-target cursor-pointer"
                    key={note.uid}
                    ref={(el) => {
                        if (note.uid) {
                            // 将当前 DOM 元素存储到对应的引用中
                            cardRefs.current[note.uid as unknown as number] = el;
                            sectionRefs.current[note.uid as unknown as number] = el;
                        }
                    }}
                >
                    <div>
                        {/* 卡片主体 */}
                        <div
                            onClick={() => handleUid(note.uid || '')}
                            className="group transition-colors duration-200 hover:bg-white/55 dark:hover:bg-[#26334d]"
                        >
                            <div className="px-2 py-5 sm:px-4 sm:py-6">
                                {/* 笔记标题 */}
                                <h3
                                    className="mb-3 text-xl font-semibold leading-tight text-card-foreground transition-colors duration-300 group-hover:text-brand-pink-deep sm:text-2xl"
                                >
                                    {note.title}
                                </h3>
                                {/* 标签展示 */}
                                <p className="py-2 text-sm text-muted-foreground sm:text-base">
                                    {note.pageTags.map((tag) => (
                                        <span key={tag} className="mr-2 inline-block rounded-md border border-brand-pink/15 bg-brand-pink-soft/45 px-2.5 py-0.5 text-xs text-brand-pink-deep dark:border-[#8fb7df]/20 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]">
                                            {tag}
                                        </span>
                                    ))}
                                </p>

                                {/* 创建时间与最后更新时间 */}
                                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-brand-pink/10 pt-3 text-xs dark:border-[#8fb7df]/14 sm:text-sm">
                                    <span className="text-muted-foreground/70">创建时间：{note.dateStart}</span>
                                    <span className="text-muted-foreground/70">最后更新：{note.dateEnd}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )

}
