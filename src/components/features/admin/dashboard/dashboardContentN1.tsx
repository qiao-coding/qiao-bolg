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
        <header className="text-xl font-bold text-brand-grad mb-6">
          最近更新笔记
        </header>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-[28px] border border-border/40 bg-card/60 p-4 animate-pulse"
            >
              <div className="h-4 bg-brand-blue-soft/50 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-brand-pink-soft/40 rounded mb-1 w-full"></div>
              <div className="h-3 bg-brand-pink-soft/40 rounded w-1/2"></div>
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
            <article className="p-4 group relative overflow-hidden rounded-[28px]
            border border-white/70 bg-card/72 backdrop-blur-md
            shadow-[0_24px_70px_rgba(255,132,189,0.14)] transition-all duration-300 cursor-pointer
            hover:scale-102 hover:-translate-y-1 hover:shadow-2xl
             dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/74">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-brand-blue-deep dark:group-hover:text-brand-blue transition-colors">
                  {article.title.length > 10 ? article.title.slice(0, 10)+'...' : article.title}
                </h3>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                  {article.dateStart}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                {(article.pageTags || []).map((tag: string, tagIndex: number) => (
                  <span
                    key={`${article.id}-tag-${tagIndex}`}
                    className="text-xs px-2 py-1 rounded-full font-medium bg-brand-pink-soft text-brand-pink-deep dark:bg-[#f0b8d4]/15 dark:text-[#ffddec]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {article.content.slice(0, 60)}...
              </p>

            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}