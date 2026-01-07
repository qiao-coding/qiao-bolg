'use client'
import { Note } from "@/types/note/type";
import { motion } from "framer-motion";
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
    const sort_notes = note.page && note.page.sort((a, b) => {
        const aDate = new Date(a.dateEnd || '');
        const bDate = new Date(b.dateEnd || '');
        return bDate.getTime() - aDate.getTime();
    });

    return (
        <div className="flex flex-col ">
            {/* 遍历排序后的笔记列表 */}
            {sort_notes && sort_notes.map((note) => (
                <div
                    id={`section-${note.uid}`}
                    className="cursor-target  cursor-pointer
                      grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 
                    sm:w-[80vw] md:w-[65vw] lg:w-[40vw] m-auto p-4 
                    "
                    key={note.uid}
                    ref={(el) => {
                        if (note.uid) {
                            // 将当前 DOM 元素存储到对应的引用中
                            cardRefs.current[note.uid as unknown as number] = el;
                            sectionRefs.current[note.uid as unknown as number] = el;
                        }
                    }}
                >
                    {/* 鼠标悬停时的动画效果 */}
                    <motion.div
                        whileHover={{ scale: 1.05, transition: { duration: 0.3 }, translateY: -10 }}
                    >
                        {/* 卡片主体 */}
                        <div
                            onClick={() => handleUid(note.uid || '')}
                            className="group bg-card/70 rounded-xl shadow-lg 
                    hover:shadow-xl transition-all duration-300 overflow-hidden
                     border border-border/50 hover:border-primary/30"
                        >
                            <div className="p-6 sm:p-7 ">
                                {/* 笔记标题 */}
                                <h3
                                    className="text-xl sm:text-2xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300 leading-tight font-sans text-card-foreground"
                                >
                                    {note.title}
                                </h3>
                                {/* 标签展示 */}
                                <p className="text-[#64748B] text-sm sm:text-base py-2">
                                    {note.pageTags.map((tag) => (
                                        <span key={tag} className="inline-block bg-[#E0F2FE] text-[#0369A1] text-xs font-medium rounded-full px-2.5 py-0.5 mr-2">
                                            {tag}
                                        </span>
                                    ))}
                                </p>

                                {/* 创建时间与最后更新时间 */}
                                <div className="flex justify-between items-center text-xs sm:text-sm pt-3 border-t border-[#EFF6FF]">
                                    <span className="text-[#94A3B8]">创建时间：{note.dateStart}</span>
                                    <span className="text-[#94A3B8]">最后更新：{note.dateEnd}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            ))}
        </div>
    )

}