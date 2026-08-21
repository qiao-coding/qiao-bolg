"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { Note, NotesPage } from "@/types/note/type";
import { useT } from "@/i18n/LocaleContext";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/shadcnComponents/forms/button";


const HomeArticles = () => {
  const t = useT();
  const [articles, setArticles] = useState<NotesPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [notesPage, setNotesPage] = useState<Note[]>([]);

  const handleArticleClick = useCallback((noteId: string, pageId?: string) => {
    router.push(`/notes/${noteId}/${pageId}`);
  }, [router]);



  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/notes`, { signal: controller.signal });

        if (response.ok) {
          const data = await response.json();


          const page: Note[] = data
          if (!isMounted) return;
          setNotesPage(page)


          const resData = page.map(n => n.page).flat()



          const allArticles: NotesPage[] = [...(resData as NotesPage[]).map((note: NotesPage) => ({
            id: note.id,
            uid: note.uid,
            title: note.title || t('home.uncategorized'),
            author: note.author || t('home.unknownAuthor'),
            dateStart: note.dateStart || '',
            dateEnd: note.dateEnd || '',
            pageTags: Array.isArray(note.pageTags) ? note.pageTags : [],
            picture: "",
            noteId: note.noteId,
            note: note.note,
            content: note.content || '',
            pageId: note.pageId,
          }))]





          allArticles.sort((a, b) => new Date(b.dateEnd || '').getTime() - new Date(a.dateEnd || '').getTime());

          setArticles(allArticles.slice(0, 6));
        } else {
          if (!isMounted) return;
          setError(`API错误: ${response.status}`);
        }
      } catch (error) {
        if (!isMounted || (error instanceof DOMException && error.name === 'AbortError')) {
          return;
        }
        setError(`${error instanceof Error ? error.message : t('common.blogName')}`);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchArticles();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [t]);





 //文章列表
  const articlesList = useMemo(() => {
    return articles.map((article, index) => (
      <article
        key={`${article.noteId}-${article.id}-${index}`}
        onClick={() => article.noteId && handleArticleClick(String(article.noteId), article?.uid)}

        className={`
          group overflow-hidden rounded-3xl border border-white/80 bg-white/76
          shadow-[0_14px_34px_rgba(255,132,189,0.12)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-pink/45 hover:shadow-[0_18px_42px_rgba(255,143,199,0.18)] cursor-pointer dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/76 dark:shadow-[0_14px_34px_rgba(10,18,34,0.24)] dark:hover:border-[#8fb7df]/36
        `}
      >
        <div className="relative h-36 overflow-hidden bg-brand-grad-soft">
          <Image
            fill
            src={notesPage.find(n => n.id.toString() === article.noteId)?.titlePicture || "/note_img/pageData.png"}
            alt={article.title}
            className="object-cover opacity-95 transition-transform duration-300 group-hover:scale-[1.04]"
            sizes="lg:80vw, md:25vw, 20vw"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/78 to-transparent dark:from-background/70" />
        </div>

        <div className="flex flex-col justify-between p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className={`text-lg
            text-foreground
               font-semibold transition-colors
               line-clamp-2
                group-hover:text-brand-pink-deep `}>
              {article.title.length > 12 ? article.title.substring(0, 12) + '...' : article.title}
            </h3>
            <span className={`text-xs flex-shrink-0 ml-2
               text-muted-foreground
               `}>
                {t('home.lastUpdate')}
              {article.dateEnd}
            </span>
          </div>


          <div className="flex flex-wrap gap-1 mb-2">

            {(article.pageTags || []).map((tag: string, tagIndex: number) => (
              <span
                key={`${article.id}-tag-${tagIndex}`}
                className={`rounded-full border border-brand-pink/25 bg-brand-pink-soft/80 px-2.5 py-1 text-xs font-semibold text-brand-pink-deep dark:border-[#8fb7df]/20 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8] `}
              >
                {tag}
              </span>
            ))}
          </div>

        </div>
      </article>
    ));
  }, [articles, handleArticleClick, notesPage, t]);

   //加载状态
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-brand-blue" />
          <p className={`mt-4 text-foreground`}>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  //错误状态
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className={`text-3xl font-semibold mb-4 text-foreground`}>{t('home.newestNotes')}</h2>
          <div className={`border px-4 py-3 rounded-md mb-8 bg-destructive/10 text-destructive`}>
            <p className="font-bold">{t('home.fetchError')}</p>
            <p>{error}</p>
          </div>
          <Button
            variant="destructive"
            onClick={() => window.location.reload()}
          >
            {t('home.reload')}
          </Button>
        </div>
      </div>
    );
  }

  //无数据状态
  if (articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className={`text-3xl font-bold mb-4 `}>{t('home.newestNotes')}</h2>
          <p className={`text-lg mb-8 `}>{t('home.noNotes')}</p>
          <div className={`rounded-lg border border-border/70 bg-card/80 p-8 text-muted-foreground`}>
            <p className={``}>{t('home.noNotesInDb')}</p>
            <p className={`text-sm mt-2 `}>{t('home.checkDb')}</p>
          </div>
        </div>
      </div>
    );
  }

   
  return (
    <div className="container mx-auto px-4 pb-16 pt-4">
      <div className="mx-auto mb-8 flex max-w-6xl flex-col gap-2 text-left text-foreground sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand-blue/25 bg-white/70 px-3 py-1 text-xs font-medium text-brand-blue-deep shadow-sm dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]">
            <Sparkles className="size-3.5" />
            Recent diary
          </p>
          <h2 className={`text-3xl font-black mb-2 text-brand-grad `}>
            {t('home.latestNotes')}
          </h2>
          <p className={`text-sm text-muted-foreground`}>{t('home.foundNotes', { count: articles.length })}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {articlesList}
      </div>

    </div>
  );
};

export default HomeArticles;
