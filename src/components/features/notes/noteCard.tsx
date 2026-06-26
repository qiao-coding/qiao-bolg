"use client";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/shadcnComponents/data-display/card";
import { Note } from "@/types/note/type";
import { BookOpen, FileText } from "lucide-react";

const NotesCard = ({
  note
}: {
  note: Note;
}) => {
  const router = useRouter();

  const {id, title, tags, titlePicture, page} = note;

  const handleNotesID = (notesID: number) => {
    router.push(`/notes/${notesID}`);
  };

  return (
    <Card
      key={id}
      className="
        my-0 py-0
        w-full overflow-hidden
        bg-white/60 dark:bg-gray-700/80
        text-card-foreground
        rounded-xl border border-border/50
        shadow-sm hover:shadow-md transition-all duration-300
        cursor-pointer hover:border-primary/30
        hover:scale-[1.02] active:scale-[0.98]
        dark:hover:shadow-primary/20
        group backdrop-blur-sm
      "
    >
      {/* 主体：封面 + 内容 */}
      <div onClick={() => handleNotesID(Number(id))}
        className="flex gap-2 md:flex-row-reverse cursor-pointer">
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
            <div className="w-full h-full bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
              <span className="text-muted-foreground text-lg font-medium text-center px-2 line-clamp-2">{title}</span>
            </div>
          )}
        </div>

        {/* 内容 */}
        <div className="p-4 w-full flex md:flex-1 flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold transition-colors line-clamp-2 group-hover:text-primary">
              {title}
            </h3>
            <span className="text-xs px-2 py-1 rounded-sm font-medium bg-gray-700/60 text-white bg-sky-400/60 dark:bg-sky-700 md:absolute top-2 right-2">
              共 {page?.length} 篇笔记
            </span>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-1 mb-2">
            {tags && tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full font-medium bg-gray-700/60 text-white bg-sky-400/60 dark:bg-sky-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotesCard;