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
            icon: <FileText className="h-6 w-6 text-brand-blue-deep dark:text-brand-blue" />,
        },
        {
            title: '相关笔记',
            value: notes.reduce((sum, note) => sum + (note.page || []).length, 0),
            icon: <BookOpen className="h-6 w-6 text-green-600 dark:text-green-300" />,
        },

        {
            title: '相关标签',
            value: allTags.length,
            icon: <Tag className="h-6 w-6 text-brand-pink-deep dark:text-brand-pink" />,
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
                    relative overflow-hidden rounded-[28px] border border-white/70 bg-card/72 shadow-[0_24px_70px_rgba(255,132,189,0.14)] backdrop-blur-md dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/74 dark:shadow-[0_24px_70px_rgba(10,18,34,0.28)]
                     "
                >
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">{item.title}</p>
                                <h3 className="text-3xl font-bold text-brand-grad transition-all duration-300">
                                    {item.value}
                                </h3>
                            </div>
                            <div className="p-3 rounded-full bg-brand-grad-soft transition-all duration-300">
                                {item.icon}
                            </div>
                        </div>
                    </CardContent>
                </Card>

            ))}
        </div>
    )

}