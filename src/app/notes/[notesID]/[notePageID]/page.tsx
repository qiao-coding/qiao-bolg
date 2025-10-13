'use client'
import NextRouter from '@/components/layout/NextRouter';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useTheme } from 'next-themes';
import 'highlight.js/styles/github.css';
import { Moon, Sun, ArrowLeft, Share2, Heart, MessageSquare, Calendar, Clock, User, Bookmark, ChevronRight }
 from 'lucide-react';
import { Switch } from '@/components/ui/shadcnComponents/switch';
import TechBackgroundNoGrid from '@/components/ui/public/background_img';
import LoadingPage from '@/components/ui/shadcnComponents/loadingPage';
import ThemePage from '@/components/ui/public/themePage';

interface Note {
  id: number;
  title: string;
  tags: string[];
  titlePicture: string | null;
  page: NotesPage[];
}

interface NotesPage {
  id: number;
  uid: number;
  title: string;
  content: string;
  author: string;
  dateStart: string;
  dateEnd: string;
  pageTags: string[];
  noteId: number | null;
}

const NotePage = () => {
  const { notesID, notePageID } = useParams();
  const { theme } = useTheme();
  const [note, setNote] = useState<Note | null>(null);
  const [notesPage, setNotesPage] = useState<NotesPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);



  // 获取数据
  useEffect(() => {
    const fetchNotes = async () => {
      if (!notesID) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/notes/${notesID}`);
        if (!res.ok) {
          throw new Error('获取笔记详情失败');
        }
        const data = await res.json();
        setNote(data);

        const page = data.page.find((p: NotesPage) => p.uid.toString() === notePageID);
        if (page) {
          setNotesPage(page);
        } else {
          console.error('页面未找到');
        }
      } catch (error) {
        console.error('获取笔记详情失败', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, [notesID, notePageID]);



  // 加载状态
  if (isLoading || !notesPage || !note) {
    return (
      <article>
        <TechBackgroundNoGrid>
          <div className="fixed top-0 left-0 w-full h-full">
            <div className="w-full">
              <LoadingPage />
            </div>
          </div>
        </TechBackgroundNoGrid>
      </article>
    );
  }

  return (
    <div className={`  font-sans transition-colors duration-300 ${theme === 'light' ? 'bg-[#FAFAFA]' : 'bg-gray-900'}`}>
      <NextRouter showHeader={false}>
        <header 
          className={`sticky top-0 z-30 border-b shadow-sm backdrop-blur-sm transition-all duration-300 ${theme === 'light' 
            ? 'bg-white/90 border-[#EDEFF2]' 
            : 'bg-gray-900/90 border-gray-800' 
          }`}>
          <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link
              href={`/notes/${notesID}`}
              className={`flex items-center transition-colors ${theme === 'light' ? 'text-[#8A94A6] hover:text-[#4A6FA5]' : 'text-gray-400 hover:text-blue-400'}`}
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              <span>返回列表</span>
            </Link>

            <div className="flex items-center gap-4">
              <ThemePage/>

            </div>
          </div>
        </header>

        <main
          className="min-h-screen container mx-auto px-4 sm:px-6 py-8 max-w-3xl"
          key={notesPage.uid}
        >

          <div className={`mb-8 ${theme === 'light' ? 'text-[#2D3748]' : 'text-gray-100'}`}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight animate-fade-in">
              {notesPage.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <div className={`flex items-center gap-1.5 ${theme === 'light' ? 'text-[#8A94A6]' : 'text-gray-400'}`}>
                <Calendar className="w-4 h-4" />
                发布于{notesPage.dateStart}
              </div>
              <div className={`flex items-center gap-1.5 ${theme === 'light' ? 'text-[#8A94A6]' : 'text-gray-400'}`}>
                <Clock className="w-4 h-4" />
                最后编辑：{notesPage.dateEnd}
              </div>
            </div>
          </div>

          <div className={`${theme === 'light' ? 'text-[#4A5568]' : 'text-gray-300'} mb-12`}>
            

            <div className={`prose min-h-[50vh] prose-slate max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw, rehypeSanitize]}
                components={{
                  p: ({ className, ...props }) => <p className={`my-4 leading-relaxed ${className || ''}`} {...props} />,
                  h1: ({ className, ...props }) => <h1 className={`text-3xl font-bold mt-8 mb-4 ${className || ''}`} {...props} />,
                  h2: ({ className, ...props }) => <h2 className={`text-2xl font-bold mt-8 mb-3 ${className || ''}`} {...props} />,
                  h3: ({ className, ...props }) => <h3 className={`text-xl font-bold mt-6 mb-2 ${className || ''}`} {...props} />,
                  code: ({ className, ...props }) => <code className={`font-mono text-sm ${theme === 'light' ? 'text-[#6B7A90]' : 'text-gray-400'} ${className || ''}`} {...props} />,
                  pre: ({ className, ...props }) => <pre className={`p-4 rounded-lg bg-black/10  overflow-x-auto my-4 ${className || ''}`} {...props} />,
                  a: ({ className, ...props }) => <a 
                    className={`${theme === 'light' ? 'text-[#4A6FA5] hover:text-[#3A5F95] underline' : 'text-blue-400 hover:text-blue-300 underline'}`} 
                    {...props} />
                }}
              >
                {notesPage.content}
              </ReactMarkdown>
            </div>

            <div className={`mt-8 pt-6 border-t transition-all duration-300 ${theme === 'light' ? 'border-[#EDEFF2]' : 'border-gray-700'}`}>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`text-sm ${theme === 'light' ? 'text-[#8A94A6]' : 'text-gray-400'}`}>标签：</span>
                {notesPage.pageTags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/article?tag=${encodeURIComponent(tag)}`}
                    className={`text-sm px-3 py-1.5 rounded-full transition-all duration-300 ${theme === 'light' 
                      ? 'bg-[#E9EEF6] text-[#4A6FA5] hover:bg-[#D9E2EC] hover:shadow-sm' 
                      : 'bg-gray-800 text-blue-400 hover:bg-gray-700 hover:shadow-sm' 
                    }`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </main>
      </NextRouter>
    </div>
  );
};

export default NotePage;
