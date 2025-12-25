"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Note, NotesPage } from "@/types/note/type";


const HomeArticles = () => {
  const [articles, setArticles] = useState<NotesPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [notesPage, setNotesPage] = useState<Note[]>([]);  

  const handleArticleClick = useCallback((noteId: string,pageId?:string) => {
    const pageIdList=
    router.push(`/notes/${noteId}/${pageId}`);
  }, [router]);


  useEffect(() => {
    if (resolvedTheme) {
      setIsDark(resolvedTheme === "dark");
    }
  }, [resolvedTheme]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/notes`);

        if (response.ok) {
          const data = await response.json();
          
    
          const page:Note[]=data
          setNotesPage(page)
          
         
          const resData=page.map(n=>n.page).flat()

          

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

          

          

          allArticles.sort((a, b) => new Date(b.dateStart||'').getTime() - new Date(a.dateStart||'').getTime());

          setArticles(allArticles.slice(0, 6));
        } else {
          setError(`API错误: ${response.status}`);
        }
      } catch (error) {
        setError(`网络错误: ${error instanceof Error ? error.message : '未知错误'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  
  



  const articlesList = useMemo(() => {
    return articles.map((article, index) => (
      <article
        key={`${article.noteId}-${article.id}-${index}`}
        onClick={() => article.noteId && handleArticleClick(article.noteId,article?.uid)}

        className={`
          group backdrop-blur-sm rounded-lg border transition-all duration-300 cursor-target 
          overflow-hidden hover:scale-102 hover:-translate-y-1 shadow-md hover:shadow-lg
          bg-white/60 dark:bg-gray-500/60 cursor-pointer
        `}
      >
        <div className="relative h-32 overflow-hidden">
          <Image
            fill
            src={notesPage.find(n=>n.id.toString() ===article.noteId)?.titlePicture || "/bg-1.png"}
            alt={article.title}
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="lg:80vw, md:25vw, 20vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className={`text-lg font-semibold transition-colors line-clamp-2  group-hover:text-blue-400 `}>
              {article.title}
            </h3>
            <span className={`text-xs flex-shrink-0 ml-2 `}>
              {article.dateStart}
            </span>
          </div>


          <div className="flex flex-wrap gap-1 mb-2">
      
            {(article.pageTags || []).map((tag: string, tagIndex: number) => (
              <span
                key={`${article.id}-tag-${tagIndex}`}
                className={`text-xs px-2 py-1 rounded-full font-medium bg-gray-700/60 text-white bg-sky-400/60 dark:bg-sky-700 `}
              >
                {tag}
              </span>
            ))}
          </div>

        </div>
      </article>
    ));
  }, [articles, handleArticleClick]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className={`mt-4 text-white`}>加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className={`text-4xl font-bold mb-4 text-white`}>最新笔记</h2>
          <div className={`border px-4 py-3 rounded mb-8 bg-red-500/20 text-red-500`}>
            <p className="font-bold">获取笔记失败</p>
            <p>{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-error"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className={`text-3xl font-bold mb-4 `}>最新笔记</h2>
          <p className={`text-lg mb-8 `}>暂无笔记数据</p>
          <div className={`rounded-lg p-8 bg-red-500/20 text-red-500`}>
            <p className={``}>数据库中没有找到笔记数据</p>
            <p className={`text-sm mt-2 `}>请检查数据库连接或运行数据库种子脚本</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-3 `}>
          最新笔记
        </h2>
        <p className={`text-sm mt-2 `}>找到 {articles.length} 篇笔记</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:w-[80vw] gap-4 m-auto">
        {articlesList}
      </div>

    </div>
  );
};

export default HomeArticles;
