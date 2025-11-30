"use client";
import { miscellaneousType } from "@/types/miscellaneous/type";
import Image from "next/image";

export function MiscellaneousTimelineItem({
  item,
  index,
}: {
  item: miscellaneousType;
  index: number;
}) {

  return (
    <li className=" z-10 mb-10 md:mb-16 last:mb-0 ">
      <div className="timeline-start relative   pr-8 md:pr-12 pl-4 md:pl-0 min-h-[100px] w-full lg:w-90 pl-4 cursor-pointer">
        <div className="p-6 md:p-8 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md bg-white hover:translate-x-1">
          <p className="text-gray-700 leading-relaxed text-base md:text-lg">
            {item.content}
          </p>

        </div>
      </div>

      <div className="flex items-center justify-center hidden md:block  gap-3">
        <Image
          src="/UserImage/up.jpg"
          alt="User Image"
          width={100}
          height={100}
          className="w-12 h-12 rounded-full mt-6"
        />
        <span>
          <p className="text-sm font-medium absolute text-gray-500">记录于  {item.date}</p>
        </span>
      </div>
    </li>
  );
}
