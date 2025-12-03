import Image from "next/image";
import { Badge } from "@/components/ui/shadcnComponents/badge";
import { SiGitee } from "react-icons/si";
import { ExternalLink, Github } from "lucide-react";


export default function NotesSideber() {

  const badgeTags = ["React", "JavaScript", "Next.js", "TypeScript", "Tailwind CSS"];

  const lianxi_data = [
    {
      icon: <Github className="w-4 h-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300" />,
      title: "GitHub",
      text: "https://github.com/xier123456",
    },
    {
      icon: <SiGitee className="w-4 h-4  bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400" />,
      title: 'Gitee',
      text: "https://xier123456.github.io/",
    },
  ]

  return (
    <div className="hidden lg:block lg:w-[200px] xl:w-[250px] bg-white dark:bg-gray-800/90 rounded-2xl shadow-sm dark:shadow-lg dark:shadow-gray-900/20 p-6 sticky top-24 self-start dark:border dark:border-gray-700">
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-5">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg dark:shadow-gray-900/50">
            <Image
              src="/UserImage/up.jpg"
              alt="个人头像"
              width={128}
              height={128}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          <div className="absolute -inset-1 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow"></div>
        </div>

        <h1 className="text-xl font-bold mb-1 text-gray-800 dark:text-white">昊小白</h1>

        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
          {badgeTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3 mb-6" >

        <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-white">联系方式</h3>
        {lianxi_data.map((item, index) => (

          <a
            key={index}
            href={item.text}
            className="flex items-center gap-2 p-2.5 rounded-lg transition-all bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="p-1.5 rounded-lg">
              {item.icon}
            </div>
            <span className="text-sm truncate">Gitee</span>
            <ExternalLink className="w-3.5 h-3.5 ml-auto" />

          </a>
        ))}

      </div>




    </div>
  )

}