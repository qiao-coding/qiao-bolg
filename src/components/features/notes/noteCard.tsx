"use client";
import { useRouter } from "next/navigation";

import Image from "next/image";

const NotesCard = ({
  id,
  title,
  tags,
  titlePicture,
}: {
  id: number;
  title: string;
  tags: string[];
  titlePicture: string;
}) => {
  const router = useRouter();


  const handleNotesID = (notesID: number) => {
    router.push(`/notes/${notesID}`);
  };

  return (
    <article
      key={id}
      onClick={() => handleNotesID(Number(id))}
      className="
        group
        bg-sky-100/90 dark:bg-slate-800/80 text-card-foreground
        rounded-xl
        border border-border/50
        shadow-sm hover:shadow-md
        transition-all duration-300
        cursor-pointer
        overflow-hidden
        hover:border-primary/30
        hover:scale-[1.02]
        active:scale-[0.98]
        xl:w-170
        dark:hover:shadow-primary/20
      "
    >
      <div className="flex gap-4">
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags && tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full border border-border/50 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="relative flex-shrink-0 w-90 h-45 sm:w-100 md:w-90 lg:w-90 xl:w-100 2xl:w-120">
          {titlePicture ? <Image
            fill
            src={titlePicture}
            alt={title}
            className="object-cover rounded-r-xl group-hover:brightness-110 transition-all duration-300"
            sizes="(max-width: 640px) 100px, (max-width: 768px) 90px, (max-width: 1024px) 90px, (max-width: 1280px) 100px, 120px"
          />
            : (
              <div className="w-full h-full bg-muted rounded-r-xl flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                <span className="text-muted-foreground text-lg font-medium text-center px-2 line-clamp-2">{title}</span>
              </div>
            )}
        </div>
      </div>
    </article>
  );
};

export default NotesCard;
