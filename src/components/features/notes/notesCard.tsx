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
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (!resolvedTheme) {
      setIsDark(resolvedTheme === "light");
      setIsDark(resolvedTheme === "dark");
    } else {
      setIsDark(resolvedTheme === "dark");
      setIsDark(resolvedTheme === "light");
    }
  }, [resolvedTheme]);


  const handleNotesID = (notesID: number) => {
    router.push(`/notes/${notesID}`);
  };

  return (
    <article
      key={id}
      onClick={() => handleNotesID(Number(id))}
      className={`
        ${isDark
          ? "bg-white rounded-lg border border-gray-200 pr-0 shadow-md  hover:shadow-gray-500 transition-shadow duration-300 cursor-target  overflow-hidden"
          : " bg-gray-700/80 rounded-lg border border-gray-200group rounded-xl pr-0 shadow-[0_2px_12px_rgba(59,130,246,0.07)] hover:shadow-white transition-all duration-300 cursor-target hover:shadow-white overflow-hidden"
        } xl:w-170` }
    >
      <div className="flex gap-4 ">
        <div className="p-6 ">
          <div className="flex justify-between items-start mb-3 sm:w-40 md:w-30 lg:w-40 ">
            <h3
              className={
                isDark
                  ? "text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                  : "text-xl font-semibold text-white hover:text-blue-600 transition-colors"
              }
            >
              {title}
            </h3>
          </div>


          <div className="flex flex-wrap gap-2">
            {tags && tags.map((tag, index) => (
              <span
                key={index}
                className={
                  isDark
                    ? "text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    : "text-xs bg-white text-gray-700 px-2 py-1 rounded-full"
                }
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="relative flex-shrink-0  sm:w-100 md:w-90 lg:w-90 xl:w-100 2xl:w-120  w-90 h-45" >
          <Image
            fill
            src={titlePicture ?? ""}
            alt="1"
            className="object-cover rounded-r-lg"
            sizes="160px"
          />
        </div>
      </div>
    </article>
  );
};

export default NotesCard;
