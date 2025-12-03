"use client";
import { useRouter } from "next/navigation";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

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
        bg-white dark:bg-gray-700/80
        rounded-lg dark:rounded-xl
        border border-gray-200 dark:border-gray-200
        pr-0
        shadow-md dark:shadow-[0_2px_12px_rgba(59,130,246,0.07)]
        hover:shadow-gray-500 dark:hover:shadow-white
        transition-shadow dark:transition-all
        duration-300
        cursor-target
        overflow-hidden
        xl:w-170
      "
    >
      <div className="flex gap-4">
        <div className="p-6">
          <div className="flex justify-between items-start mb-3 sm:w-40 md:w-30 lg:w-40">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white hover:text-blue-600 transition-colors">
              {title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags && tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 dark:bg-white text-gray-700 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="relative flex-shrink-0 sm:w-100 md:w-90 lg:w-90 xl:w-100 2xl:w-120 w-90 h-45">
          {titlePicture ? <Image
            fill
            src={titlePicture}
            alt="1"
            className="object-cover rounded-r-lg"
            sizes="160px"
          />
            : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-600 rounded-r-lg flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-300 text-lg">{title}</span>
              </div>
            )}
        </div>
      </div>
    </article>
  );
};

export default NotesCard;
