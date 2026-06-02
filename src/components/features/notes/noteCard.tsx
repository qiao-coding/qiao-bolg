"use client";
import { useRouter } from "@/i18n/navigation";

import Image from "next/image";
import { Card } from "@/components/ui/shadcnComponents/data-display/card";
import { Note } from "@/types/note/type";

const NotesCard = ({
  note
}: {
  note: Note;
}) => {
  const router = useRouter();

  const {id, title, tags, titlePicture,page} = note;

  


  const handleNotesID = (notesID: number) => {
    router.push(`/notes/${notesID}`);
  };

  return (
    <Card
      key={id}
      onClick={() => handleNotesID(Number(id))}
      className="
        my-0 py-0   
        w-full
        gap-2 md:flex-row-reverse
        bg-sky-100/90 dark:bg-slate-800/80 
        text-card-foreground 
        rounded-xl border border-border/50 
        shadow-sm hover:shadow-md transition-all duration-300 
        cursor-pointer overflow-hidden hover:border-primary/30
        hover:scale-[1.02] active:scale-[0.98]
        dark:hover:shadow-primary/20
        group backdrop-blur-sm rounded-lg border transition-all duration-300 
        cursor-target 
        overflow-hidden 
        hover:scale-102 hover:-translate-y-1 shadow-md hover:shadow-lg
        bg-white/60 dark:bg-gray-700/80 cursor-pointer
      "
    >
      {/* 封面图片 */}
      <div className="relative w-full md:flex-2 h-32 md:h-45 overflow-hidden">
        {titlePicture ? (
          <Image
            fill
            src={titlePicture}
            alt={title}
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="lg:80vw, md:25vw, 20vw"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted  flex items-center justify-center group-hover:bg-muted/80 transition-colors">
            {/* 默认文本 */}
            <span className="text-muted-foreground text-lg font-medium text-center px-2 line-clamp-2">{title}</span>
          </div>
        )}
      </div>

      {/* 内容 */}
      <div className="p-4 w-full flex md:flex-1 flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          {/* 标题 */}
          <h3 className={`text-xl font-semibold transition-colors  
            line-clamp-2 
            group-hover:text-primary `}>
            {title}
          </h3>
          {/* 笔记数 */}
          <span className="text-xs px-2 py-1
           rounded-sm font-medium 
           bg-gray-700/60 
           text-white
            bg-sky-400/60 dark:bg-sky-700
             md:absolute top-2 right-2">
            共 {page?.length} 篇笔记
          </span>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1 mb-2">
          {tags && tags.map((tag, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-1 rounded-full font-medium bg-gray-700/60 text-white bg-sky-400/60 dark:bg-sky-700`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default NotesCard;