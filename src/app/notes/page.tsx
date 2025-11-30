'use client'
import NextRouter from "@/components/layout/NextRouter";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import { useEffect, useState } from "react";
import NotesSideber from "@/components/ui/notes/NotesSideber";
import AnimatedContent from "@/components/ui/shadcnComponents/AnimatedContent";
import { motion } from "framer-motion";
import { useNotes } from "@/hooks/note/useNotes";
import { Note } from "@/types/note/type";
import NotesCard from "@/components/features/notes/notesCard";



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

  console.log(notes);
  





  return (
    <TechBackgroundNoGrid>
      <NextRouter>
        <AnimatedContent
          distance={150}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={1}
          threshold={0.1}
        >
            <main className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen max-w-5xl mx-auto pt-28">
              <Title>学习笔记</Title>
              <div className="flex justify-center w-full">
                <section className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 sm:w-[80vw] md:w-[65vw] lg:w-[50vw] gap-6 m-auto">
                  {notes.map((note) => (
                    <article key={note.id} className="cursor-pointer">
                      <motion.div
                        whileHover={{ transition: { duration: 0.3 }, translateY: -15 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <NotesCard id={note.id} title={note.title} tags={note.tags ||[]} titlePicture={note.titlePicture || ""} />
                      </motion.div>
                    </article>
                  ))}
                </section>
                <aside className="hidden lg:block lg:w-[200px] xl:w-[250px] px-0 ml-8">
                  {notes.length > 0 && <NotesSideber />}
                </aside>
              </div>
            </main>
        </AnimatedContent>
      </NextRouter>
    </TechBackgroundNoGrid>



  );
};

export default Article;
