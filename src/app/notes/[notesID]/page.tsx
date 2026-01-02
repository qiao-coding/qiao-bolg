"use client";
import NextRouter from "@/components/layout/NextRouter";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageNavigation from "@/components/features/notes/PageNavigation";
import LoadingPage from "@/components/ui/public/loadingPage";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import { useNotes } from "@/hooks/note/useNotes";
import { Note, NotesPage } from "@/types/note/type";
import { NoteListCard } from "@/components/features/notes/noteListCard";
import { NoteListHeader } from "@/components/features/notes/noteListHeader";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { ArrowUpIcon } from "lucide-react";
import { motion } from "framer-motion";




const Notestitle = () => {
  const { notesID } = useParams();
  const router = useRouter();

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);





  //获取noteList(GET)
  useEffect(() => {
    const fetchNotes = async () => {
      if (!notesID) return

      try {
        const res = await useNotes.getNoteList(notesID as string)
        if (res) {
          setNote(res)
          setLoading(true)
        }
      } catch (error) {
        console.error('数据获取失败', error);
        setLoading(false)

      } finally {
      }
    }
    fetchNotes()
  }, [notesID])

  const handleUid = (notePageID: string) => {
    router.push(`/notes/${notesID}/${notePageID}`);
  };





  if (!note && !loading) {
    return (
      <article>
        <TechBackgroundNoGrid>
          <div className="fixed top-0 left-0 w-full h-full ">
            <div className=" w-full ">
              <LoadingPage />
            </div>
          </div>
        </TechBackgroundNoGrid>
      </article>
    );
  }
  return (

    <div className="">
      <TechBackgroundNoGrid>
        <NextRouter showHeader={false} >
          <NoteListHeader />
          <motion.div
            initial={{ opacity: 0, y: 150, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >

            <Title>{note && note.title}</Title>

            <section className="min-h-screen">
              {note && <NoteListCard
                note={note}
                handleUid={handleUid}
              />}
            </section>




          </motion.div>

        </NextRouter>
      </TechBackgroundNoGrid>





      <aside className=" hidden lg:flex  z-50
       flex flex-col  
       fixed right-[5%] lg:right-[10%] top-[15%]
         md:right-[-20%] sm:right-[-20%]
         h-50 
          ">
        <span className="text-amber-50 text-base my-4 opacity-70 ">
          <p className="mx-1 text-sky-500 dark:text-slate-300 text-3xl font-bold">笔记目录</p>

        </span>
          <PageNavigation
            notesPage={note?.page as NotesPage[]}
            pageStyle='text-amber-50 opacity-70'
            activeStyle='text-blue-400 font-bold' />
      </aside>

      <footer
        className="fixed bottom-[3%] left-[3%] "
      >
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          variant="outline"
          aria-label="Submit"
          className="bg-card/60"

        >
          <span className="hidden md:inline-block">返回上级</span>

          <ArrowUpIcon />
        </Button>
      </footer>

    </div>
  );
};

export default Notestitle;