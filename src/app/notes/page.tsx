'use client'
import NextRouter from "@/components/layout/NextRouter";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import NotesSideber from "@/components/ui/notes/NotesSideber";
import AnimatedContent from "@/components/ui/shadcnComponents/AnimatedContent";
import NotesCard from "@/components/features/notes/NotesCard";
import { motion } from "framer-motion";



interface Note {
  id: number;

  title: string;
  tags: string[];
  titlePicture: string
  page?: NotesPage[]
}

interface NotesPage {
  id: number;
  uid: number;
  pageId: number;
  title: string;
  content: string;
  author: string;
  dateStart: string;
  dateEnd: string;
  pageTags: string[];
  noteId: number ;
  note: Note ;
}

export type{Note,NotesPage}

const Article = () => {

  // const notes = useSelector((state: RootState) => state.note).fristNotes
  const [notes, setNotes] = useState<Note[]>([])

  //数据获取
  useEffect(() => {
    const fetchNotes = async () => {
      const res = await fetch('/api/notes');

      if (!res.ok) {
        throw new Error('数据获取失败');
        }
      const data = await res.json();
      setNotes(data);
    };
    fetchNotes();
  }, []);







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
        <section className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen ">
          <div className="max-w-5xl mx-auto mt-12">
            <Title>学习笔记</Title>
            <div className="flex justify-center w-full">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 sm:w-[80vw] md:w-[65vw] lg:w-[50vw] gap-6 m-auto">
                {notes.map((note) => (
                  <div key={note.id} className="cursor-pointer">
                    <motion.div
                    whileHover={{  transition: { duration: 0.3 },translateY: -15 }}
                    whileTap={{ scale: 0.95 }}

                    >
                    <NotesCard id={note.id} title={note.title} tags={note.tags} titlePicture={note.titlePicture} />
                    </motion.div>
                  </div>
                ))}
              </div>
              <span className="hidden lg:block lg:w-[200px] xl:w-[250px] px-0 ml-8">
                {notes.length > 0 && <NotesSideber/>}
              </span>
            </div>
          </div>
        </section>
        </AnimatedContent>
      </NextRouter>
    </TechBackgroundNoGrid>



  );
};

export default Article;
