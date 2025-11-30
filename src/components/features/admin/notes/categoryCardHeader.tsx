import { Badge } from "@/components/ui/shadcnComponents/badge";
import { Note } from "@/types/note/type";
import { FileText } from "lucide-react";
import Image from "next/image";


export function NoteCategoryCardHeader({ note }: { note: Note }) {

    return (
        <header className="relative h-30 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900">
            {note.titlePicture && (
                <Image
                    src={note.titlePicture}
                    alt={note.title}
                    className="w-full h-full object-cover"
                    width={360}
                    height={180}
                />
            )}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-1 left-4 right-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white drop-shadow">
                    {note.title}
                </h3>
                <Badge className="flex items-center gap-2 bg-white text-black dark:bg-black dark:text-white">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">
                        共 {(note.page || []).length} 条笔记
                    </span>
                </Badge>
            </div>
        </header>
    )

}