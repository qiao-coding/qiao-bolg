'use client'
import { BookOpen, FileText, Tag } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/shadcnComponents/card"
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
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {noteHeaderData.map((item, index) => (
                <Card key={index}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                                <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
                            </div>
                                {item.icon}
                        </div>
                    </CardContent>
                </Card>

            ))}

        </motion.div>
    )

}