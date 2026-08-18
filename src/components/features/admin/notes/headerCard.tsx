import { BookOpen, FileText, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/shadcnComponents/data-display/card"
import { Note } from "@/types/note/type"

export function NoteHeaderCard({
    notes,
    allTags,
}: {
    notes: Note[]
    allTags: string[]
}) {

    const noteHeaderData = [
        {
            title: '笔记分类',
            value: notes.length,
            icon: <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />,
        },
        {
            title: '相关笔记',
            value: notes.reduce((sum, note) => sum + (note.page || []).length, 0),
            icon: <BookOpen className="h-6 w-6 text-green-600 dark:text-green-300" />,
        },

        {
            title: '相关标签',
            value: allTags.length,
            icon: <Tag className="h-6 w-6 text-purple-600 dark:text-purple-300" />,
        },
    ]

    return (
        <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
            {noteHeaderData.map((item, index) => (
                <Card 
                    key={index}
                    className="
                     bg-sky-50/70 dark:bg-card/60
                      border border-sky-100/70 dark:border-border/40 shadow-lg
                     "
                >
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">{item.title}</p>
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text text-transparent transition-all duration-300">
                                    {item.value}
                                </h3>
                            </div>
                            <div className="p-3 rounded-full bg-gradient-to-br from-sky-400/15 to-pink-400/10 transition-all duration-300">
                                {item.icon}
                            </div>
                        </div>
                    </CardContent>
                </Card>

            ))}
        </div>
    )

}