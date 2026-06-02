'use client'
// 仪表盘内容组件 - 展示管理员仪表盘上的内容卡片
import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { Note, NotesPage } from '@/types/note/type';

export default function DashboardContentN1() {
  const [articles, setArticles] = useState<NotesPage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notes`);

      if (response.ok) {
        const data = await response.json();
        const page: Note[] = data;
        const resData = page.map(n => n.page).flat();

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
        }))];

        
        allArticles.sort((a, b) => new Date(b.dateStart || '').getTime() - new Date(a.dateStart || '').getTime());
        setArticles(allArticles.slice(0, 3));
      }
    } catch (error) {
      console.error('获取笔记失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  

  if (loading) {
    return (
      <section className="p-6">
        <header className="text-xl font-bold text-gray-800 dark:text-white/80 mb-6">
          最近更新笔记
        </header>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="backdrop-blur-sm rounded-lg border p-4 bg-white/60 dark:bg-gray-800/60 animate-pulse"
            >
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1 w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="p-6">
      <header className="text-xl font-bold text-gray-800 dark:text-white/80 mb-6">
        最近更新笔记
      </header>
      <div className="space-y-4">
        {articles.map((article) => (
          <Link
            href={`/admin/notes/${article.id}/edit/${article.pageId}`}
            key={article.id}
            className="flex items-center justify-center"

          >
            <article className="p-4 group backdrop-blur-sm rounded-lg 
            border transition-all duration-300 cursor-pointer 
            overflow-hidden hover:scale-102 hover:-translate-y-1
             shadow-md hover:shadow-lg bg-white/60 dark:bg-gray-800/60">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white/80 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {article.title.length > 10 ? article.title.slice(0, 10)+'...' : article.title}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                  {article.dateStart}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                {(article.pageTags || []).map((tag: string, tagIndex: number) => (
                  <span
                    key={`${article.id}-tag-${tagIndex}`}
                    className="text-xs px-2 py-1 rounded-full font-medium bg-sky-400/60 dark:bg-sky-700 text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {article.content.slice(0, 60)}...
              </p>

            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}