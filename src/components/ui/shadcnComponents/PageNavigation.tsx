'use client'
import { Note, NotesPage } from "@/types/note/type";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";




export default function PageNavigation({notesValue,pageStyle,activeStyle}: {notesValue: NotesPage[] |Note[],pageStyle:string,activeStyle:string}) {

  const [activeSection,setActiveSection]=useState<number|null>(1)




     useEffect(()=>{
    if(!notesValue)return

    const observer=new IntersectionObserver(
      (entries)=>{
      entries.forEach(entry => {
      const visibleHeight = entry.intersectionRect.height;
      const totalHeight = entry.boundingClientRect.height;
      
      if (visibleHeight / totalHeight > 0.3) { // 30%可见即触发
        const uid = parseInt(entry.target.id.split('-')[1]);
        setActiveSection(uid);
      }
    });
      },{
        rootMargin:'-20% 0px -60% 0px',
        threshold:[0.1, 0.5, 0.9]
      }
    )
    notesValue.forEach(page => {
        if('uid' in page){
    const section = document.getElementById(`section-${page.uid}`);
       if (section) observer.observe(section);
        }else{
            const section = document.getElementById(`section-${page.id}`);
            if (section) observer.observe(section);
        }
  });

  return () => observer.disconnect();
  },[notesValue])

  const handleMenuClick = ( uid: number) => {
  const element = document.getElementById(`section-${uid}`);
  
  if (element) {
    const yOffset = -80; // 导航栏高度补偿
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }
}

'text-blue-400 font-bold'
'text-amber-50 opacity-70'

 notesValue
    return <div>
    {notesValue
    
    &&notesValue.map((n) => (
            <div key={'uid' in n ? n.uid : n.id} >
            <span
              onClick={() => handleMenuClick(('uid' in n ? n.uid : n.id) ?? 0)}
              className={`${
                activeSection===('uid' in n ? n.uid : n.id)
                ?`${activeStyle} rounded `
                :`${pageStyle} rounded `
                } spn1 text-amber-50 cursor-target transition-all duration-300`} 
            >
              {n.title}
            </span>
          </div>
        ))}
    </div>
}