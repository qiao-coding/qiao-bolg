'use client'
import { ScrollArea } from "@/components/ui/shadcnComponents/navigation/scroll-area";
import {  NotesPage } from "@/types/note/type";
import { useEffect, useState } from "react";




export default function PageNavigation({ notesPage, pageStyle, activeStyle }:
   { notesPage: NotesPage[] , pageStyle: string, activeStyle: string }) {

  const [activeSection, setActiveSection] = useState<number | null>(1)


  


  useEffect(() => {
    if (!notesPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const visibleHeight = entry.intersectionRect.height;
          const totalHeight = entry.boundingClientRect.height;

          if (visibleHeight / totalHeight > 0.3) { // 30%可见即触发
            const uid = parseInt(entry.target.id.split('-')[1]);
            setActiveSection(uid);
          }
        });
      }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0.1, 0.5, 0.9]
    }
    )
    notesPage.forEach(page => {
      if ('uid' in page) {
        const section = document.getElementById(`section-${page.uid}`);
        if (section) observer.observe(section);
      } else {
        const section = document.getElementById(`section-${page.id}`);
        if (section) observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [notesPage])

  const handleMenuClick = (uid: string) => {
    const element = document.getElementById(`section-${uid}`);

    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  }

      const sort_notes = notesPage && notesPage.sort((a, b) => {
        const aDate = new Date(a.dateStart || '');
        const bDate = new Date(b.dateStart || '');
        return bDate.getTime() - aDate.getTime();
    });


  return (

    
    <nav className="space-y-1">
      <ScrollArea className="h-[70vh] w-[240px] bg-card/40 
      border border-border/40
      rounded-lg
       transition-all duration-300">
        {sort_notes
          && sort_notes.map((n) => (
            <div key={'uid' in n ? n.uid : n.id} className="group mx-4 my-2">
              <button
                onClick={() => handleMenuClick(('uid' in n ? n.uid : n.id) as string)}
                className={`w-full text-left px-3 py-2 rounded-md transition-all duration-300 transform outline-none focus:outline-none focus:ring-2 focus:ring-sky-300
                ${activeSection === ('uid' in n ? n.uid : n.id)
                    ? `${activeStyle} shadow-md scale-105`
                    : `${pageStyle} hover:bg-sky-300/40 hover:scale-[1.02]`
                  } text-amber-50 cursor-pointer`}
              >
                <span className=" text-black/60 dark:text-white">{n.title.length > 10 ? n.title.slice(0, 10) + '...' : n.title}</span>
              </button>
            </div>
          ))}
      </ScrollArea>
    </nav>

  )
}