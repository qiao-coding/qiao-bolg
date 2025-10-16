"use client";
import NextRouter from "@/components/layout/NextRouter";
import AnimatedContent from "@/components/ui/shadcnComponents/AnimatedContent";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PageNavigation from "@/components/ui/shadcnComponents/PageNavigation";
import LoadingPage from "@/components/ui/shadcnComponents/loadingPage";
import ThemePage from "@/components/ui/public/themePage";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import {motion} from "framer-motion"






interface Note {
  id: number;
  title: string;
  tags: string[];
  titlePicture: string | null;
  page: NotesPage[];
}
interface NotesPage {
  id: number;
  uid: number ;
  title: string;
  contentTitle: string;
  excerpt: string;
  text1: string;
  BasicUsage: string;
  author: string;
  dateStart: string;
  dateEnd: string;
  picture: string | null;
  pageTags: string[];
  noteId: number | null;
}

export type{NotesPage,Note}
const Notestitle = () => {
  const { notesID } = useParams();
  const router = useRouter();

  const [note, setNote] = useState<Note | null>(null);
  const sectionRefs=useRef<{[key: number]: HTMLElement | null}>({})
  const [loading, setLoading] = useState(false);





  //获取数据库数据
  useEffect(()=>{
    const fetchNotes=async()=>{
      if(!notesID)return

      try {
        const res=await fetch(`/api/notes/${notesID}`)
        if(!res.ok){
          throw new Error(`数据获取失败,http状态码${res.status}`)
        }
        const data=await res.json()
        setNote(data)
        setLoading(true)
      } catch (error) {
        console.error('数据获取失败',error);
        setLoading(false)
        
      }finally{
      }
    }
    fetchNotes()
  },[notesID])

  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (resolvedTheme) {
      setIsDark(resolvedTheme === "light");
    } else {
      setIsDark(resolvedTheme === "dark");
    }
  }, [resolvedTheme]);

  const handleUid = (notePageID: number) => {
    router.push(`/notes/${notesID}/${notePageID}`);
  };

  const cardRefs = useRef<{ [key: number]: HTMLSpanElement | null }>({});


  

  if (!note&&!loading) {
    return (
      <article>
        <TechBackgroundNoGrid>
      <div className="fixed top-0 left-0 w-full h-full ">
        <div className=" w-full ">
          <LoadingPage/>
        </div>
      </div>
        </TechBackgroundNoGrid>
      </article>
    );
  }
  return (
    
    <div className="">
      <TechBackgroundNoGrid>
        <NextRouter showHeader={false}>
          <div className="flex justify-between mb-5 container mx-auto px-4 sm:px-6 py-4 flex">
            <Link
              href="/notes"
              className="flex items-center text-[#8A94A6] hover:text-[#4A6FA5] transition-colors cursor-target"
            >
              <svg
                className="mr-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>返回列表</span>
            </Link>
            <ThemePage/>
          </div>
          <AnimatedContent
            distance={150}
            direction="vertical"
            reverse={false}
            duration={1.2}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={1}
            threshold={0.1}
            delay={0}
          >
            
            <Title>{note&&note.title}</Title>
            <article className=" min-h-screen">
            <div className="flex flex-col ">
              {note&&note.page.map((note) => (
                <div
                id={`section-${note.uid}`}
                
                  className="cursor-target  cursor-pointer  grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 sm:w-[80vw] md:w-[65vw] lg:w-[40vw] m-auto p-4 "
                  key={note.uid}
                  ref={(el) => {
                    if (note.uid) {
                      cardRefs.current[note.uid] = el;
                      sectionRefs.current[note.uid] = el; 
                    }
                  }}
                >
                  <motion.div
                  whileHover={{scale:1.05,transition:{duration:0.3},translateY:-10}}
                  >
                  <div
                    onClick={() => handleUid(note.uid)}
                    className={
                      isDark
                        ? "group bg-white/70 rounded-xl shadow-[0_2px_12px_rgba(59,130,246,0.07)] hover:shadow-[0_12px_16px_rgba(59,130,246,0.12)] transition-all duration-300 overflow-hidden border border-[#EFF6FF]"
                        : "group bg-gray-900/60 rounded-xl shadow-[0_2px_12px_rgba(59,130,246,0.07)] hover:shadow-white transition-all duration-300 overflow-hidden border border-white"
                    }
                  >
                    <div className="p-6 sm:p-7 ">
                      <h3
                        className={
                          isDark
                            ? "text-xl sm:text-2xl font-semibold  mb-3 group-hover:text-[#1D4ED8] transition-colors duration-300 leading-tight font-sans text-black"
                            : "text-xl sm:text-2xl font-semibold  mb-3  transition-colors duration-300 leading-tight font-sans text-white"
                        }
                      >
                        {note.title}
                      </h3>
                      <p className="text-[#64748B] text-sm sm:text-base py-2">
                        {note.pageTags.map((tag) => (
                          <span key={tag} className="inline-block bg-[#E0F2FE] text-[#0369A1] text-xs font-medium rounded-full px-2.5 py-0.5 mr-2">
                            {tag}
                          </span>
                        ))}
                      </p>


                      <div className="flex justify-between items-center text-xs sm:text-sm pt-3 border-t border-[#EFF6FF]">
                        <span className="text-[#94A3B8]">创建时间：{note.dateStart}</span>
                        <span className="text-[#94A3B8]">最后更新：{note.dateEnd}</span>
                      </div>
                    </div>
                  </div>
                  </motion.div>
                </div>
              ))}
            </div>
            </article>
          </AnimatedContent>

          {/* text-blue-900 */}
        </NextRouter>
      </TechBackgroundNoGrid>
      <div className="cs1  n z-50 flex flex-col fixed right-[5%] lg:right-[15%] top-[30%]  md:right-[-20%] sm:right-[-20%] ">
        {note&&
        <PageNavigation
       notesValue={note.page}
       pageStyle='text-amber-50 opacity-70'
       activeStyle='text-blue-400 font-bold'/>
        }
      </div>
      
    </div>
  );
};

export default Notestitle;
