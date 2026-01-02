'use client'
import NextRouter from "@/components/layout/NextRouter";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import { useEffect, useState } from "react";
import NotesSideber from "@/components/ui/notes/noteSideber";
import { motion } from "framer-motion";
import { useNotes } from "@/hooks/note/useNotes";
import { Note } from "@/types/note/type";
import NotesCard from "@/components/features/notes/noteCard";
import { RotatingCube } from "@/components/features/mol/RotatingCube";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { ArrowUpIcon } from "lucide-react";



const Article = () => {

  const [notes, setNotes] = useState<Note[]>([])

  //数据获取
  useEffect(() => {
    const fetchNotes = async () => {
      const note = await useNotes.getNote()
      if (note) {
        setNotes(note);
      }
    };
    fetchNotes();
  }, []);

  const {data:session} = useSession()







  return (
    <TechBackgroundNoGrid>
      <NextRouter>
        <motion.div
          initial={{ opacity: 0, y: 150, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <main className="py-12 px-4 
           sm:px-6 lg:px-8 min-h-screen max-w-5xl mx-auto pt-28">
            <article>
              <Title>学习笔记</Title>
              <div className="flex justify-center w-full">
                {notes.length > 0 ? (
                  <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                   className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 
                   sm:w-[80vw] md:w-[65vw] lg:w-[50vw] gap-6 m-auto">
                    {notes.map((note) => (
                      <article key={note.id} className="cursor-pointer">
                        <motion.div
                          whileHover={{ transition: { duration: 0.3 }, translateY: -15 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <NotesCard id={note.id} title={note.title} tags={note.tags || []} titlePicture={note.titlePicture || ""} />
                        </motion.div>
                      </article>
                    ))}
                  </motion.section>
                ) : (
                  <div className="flex flex-col justify-center items-center ">
                    <RotatingCube />
                    <p className="text-3xl text-sky-400 dark:text-white font-bold">正在加载笔记...</p>
                  </div>
                )}
               {notes.length > 0 && session &&  <aside className="hidden lg:block lg:w-[200px] xl:w-[250px] px-0 ml-8">
                  <NotesSideber />
                </aside>}
              </div>
            </article>

          </main>
        </motion.div>
      </NextRouter>
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
    </TechBackgroundNoGrid>



  );
};

export default Article;