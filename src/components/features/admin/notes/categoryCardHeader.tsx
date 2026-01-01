import { Badge } from "@/components/ui/shadcnComponents/data-display/badge";
import { Note } from "@/types/note/type";
import { FileText } from "lucide-react";
import Image from "next/image";


export function NoteCategoryCardHeader({ note }: { note: Note }) {

    return (
        <header className="relative h-32 bg-gradient-to-br from-blue-100/90 via-purple-100/70 to-indigo-100/90 dark:from-slate-800/90 dark:via-slate-700/70 dark:to-slate-900/90 backdrop-blur-sm group-hover:from-blue-200/90 group-hover:via-purple-200/70 group-hover:to-indigo-200/90 dark:group-hover:from-slate-700/90 dark:group-hover:via-slate-600/70 dark:group-hover:to-slate-800/90 transition-all duration-300">
            {note.titlePicture && (
                <Image
                    src={note.titlePicture}
                    alt={note.title}
                    className="w-full h-full object-cover"
                    width={360}
                    height={180}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent group-hover:from-black/50 group-hover:via-black/30 transition-all duration-300" />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white drop-shadow-lg line-clamp-2">
                    {note.title}
                </h3>
                <Badge className="flex items-center gap-2 bg-white/95 backdrop-blur-sm text-black dark:bg-black/95 dark:text-white border border-white/30 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <FileText className="h-3 w-3" />
                    <span className="text-xs font-medium">
                        共 {(note.page || []).length} 条笔记
                    </span>
                </Badge>
            </div>
        </header>
    )

}