"use client";
import NextRouter from "@/components/layout/NextRouter";
import AnimatedContent from "@/components/ui/shadcnComponents/AnimatedContent";
import { useParams, useRouter } from "next/navigation";
import { useEffect,  useState } from "react";
import PageNavigation from "@/components/ui/shadcnComponents/PageNavigation";
import LoadingPage from "@/components/ui/shadcnComponents/loadingPage";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import { useNotes } from "@/hooks/note/useNotes";
import { Note, NotesPage } from "@/types/note/type";
import { NoteListCard } from "@/components/features/notes/noteListCard";
import { NoteListHeader } from "@/components/features/notes/noteListHeader";




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
        <NextRouter showHeader={false}>
          <NoteListHeader />
          <AnimatedContent
            distance={150}
            direction="vertical"
            reverse={false}
            duration={1.2}
            ease="power3.out"
            animateOpacity
            scale={1}
            threshold={0.1}
          >

            <Title>{note && note.title}</Title>

            {note && <NoteListCard
              note={note}
              handleUid={handleUid}
            />}
          </AnimatedContent>

        </NextRouter>
      </TechBackgroundNoGrid>




      <aside className="cs1  n z-50 flex flex-col fixed right-[5%] lg:right-[15%] top-[30%]  md:right-[-20%] sm:right-[-20%] ">
        {note &&
          <PageNavigation
            notesValue={note.page as NotesPage[]}
            pageStyle='text-amber-50 opacity-70'
            activeStyle='text-blue-400 font-bold' />
        }
      </aside>

    </div>
  );
};

export default Notestitle;
