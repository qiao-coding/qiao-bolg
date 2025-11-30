'use client'
import { Note, NotesPage } from "@/types/note/type";
import { useEffect, useState } from "react";


export default function DashboardContentN1() {

    const [articles, setArticles] = useState<NotesPage[]>([])




    const fetchArticles = async () => {
        try {

            const response = await fetch(`/api/notes`);

            if (response.ok) {
                const data = await response.json();


                const page: Note[] = data


                const resData = page.map(n => n.page).flat()



                const allArticles: NotesPage[] = [...(resData as NotesPage[]).map((note: NotesPage) => ({
                    id: note.id,
                    uid: note.uid,
                    title: note.title || '无分类',
                    author: note.author || '未知作者',
                    dateStart: note.dateStart || '',
                    dateEnd: note.dateEnd || '',
                    pageTags: Array.isArray(note.pageTags) ? note.pageTags : [],
                    picture: "",
                    noteId: note.noteId,
                    note: note.note,
                    content: note.content || '',
                    pageId: note.pageId,
                }))]


                allArticles.sort((a, b) => new Date(b.dateStart || '').getTime() - new Date(a.dateStart || '').getTime());

                setArticles(allArticles.slice(0, 3));
            } else {
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchArticles()
    }, [])



    return (
        <div className="p-6 ">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white/80 my-6">
                最近更新笔记
            </h1>
            <div className="bg-background p-6 max-w-2xl grid grid-cols-1 gap-6">
                {articles.map((article) => (
                    <div className="space-y-3" key={article.id}>
                        {/* 示例笔记卡片 */}
                        <div className="border border-sky-500/60 dark:border-white/60 border-2 rounded-lg p-6 max-w-4xl">
                            <h3 className="font-medium text-gray-900 dark:text-white/80">{article.title}</h3>
                            <p className="text-sm text-gray-600 mt-1 dark:text-white/80">{article.content.slice(0, 50)}...</p>
                            <div className="text-xs text-gray-400 mt-2 dark:text-white/80">{article.dateStart}</div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );

}