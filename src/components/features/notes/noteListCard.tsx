'use client'
import { Note } from "@/types/note/type";
import { motion } from "framer-motion";
import { useRef } from "react";



export function NoteListCard(
    {
        note,
        handleUid,

    }: {
        note: Note
        handleUid: (uid: string) => void,


    }
) {
    const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

    const cardRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});



    return (
        <div className="flex flex-col ">
            {note.page && note.page.map((note) => (
                <div
                    id={`section-${note.uid}`}

                    className="cursor-target  cursor-pointer
                      grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 
                    sm:w-[80vw] md:w-[65vw] lg:w-[40vw] m-auto p-4 
                    "
                    key={note.uid}
                    ref={(el) => {
                        if (note.uid) {
                            cardRefs.current[note.uid as unknown as number] = el;
                            sectionRefs.current[note.uid as unknown as number] = el;
                        }
                    }}
                >
                    <motion.div
                        whileHover={{ scale: 1.05, transition: { duration: 0.3 }, translateY: -10 }}
                    >
                        <div
                            onClick={() => handleUid(note.uid || '')}
                            className="group bg-card/70 rounded-xl shadow-lg 
                    hover:shadow-xl transition-all duration-300 overflow-hidden
                     border border-border/50 hover:border-primary/30"
                        >
                            <div className="p-6 sm:p-7 ">
                                <h3
                                    className="text-xl sm:text-2xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300 leading-tight font-sans text-card-foreground"
                                >
                                    {note.title}
                                </h3>
                                <p className="text-[#64748B] text-sm sm:text-base py-2">
                                    {note.pageTags.map((tag) => (
                                        <span key={tag} className="inline-block bg-[#E0F2FE] text-[#0369A1] text-xs font-medium rounded-full px-2.5 py-0.5 mr-2">
                                            {tag}
                                        </span>
                                    ))}
                                </p>


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