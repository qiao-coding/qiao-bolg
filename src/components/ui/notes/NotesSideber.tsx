'use client'
import Image from "next/image";
import { Badge } from "@/components/ui/shadcnComponents/badge";
import { useTheme } from "next-themes";
import { SiGitee } from "react-icons/si";
import { ExternalLink, Github } from "lucide-react";


export default function NotesSideber() {
  const { theme } = useTheme()
  return (
    <div className={`hidden lg:block lg:w-[200px] xl:w-[250px] ${theme === 'light'
      ? 'bg-white rounded-2xl shadow-sm p-6 sticky top-24 self-start'
      : 'bg-gray-800/90 rounded-2xl shadow-lg shadow-gray-900/20 p-6 sticky top-24 self-start border border-gray-700'
      }`}>
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-5">
          <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${theme === 'light'
            ? 'border-white shadow-lg shadow-gray-200'
            : 'border-gray-700 shadow-lg shadow-gray-900/50'
            }`}>
            <Image
              src="/UserImage/up.jpg"
              alt="个人头像"
              width={128}
              height={128}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          <div className={`absolute -inset-1 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow`}></div>
        </div>

        <h1 className={`text-xl font-bold mb-1 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>昊小白</h1>

        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
          <Badge variant="secondary" className={`${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'} text-xs`}>React</Badge>
          <Badge variant="secondary" className={`${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'} text-xs`}>JavaScript</Badge>
          <Badge variant="secondary" className={`${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'} text-xs`}>Next.js</Badge>
          <Badge variant="secondary" className={`${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'} text-xs`}>TypeScript</Badge>
          <Badge variant="secondary" className={`${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'} text-xs`}>Tailwind CSS</Badge>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <h3 className={`text-base font-semibold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>联系方式</h3>
        <a
          href="https://gitee.com/xier123456"
          className={`flex items-center gap-2 p-2.5 rounded-lg transition-all ${theme === 'light'
            ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
        >
          <div className={`p-1.5 rounded-lg ${theme === 'light' ? 'bg-red-50 text-red-500' : 'bg-red-900/30 text-red-400'}`}>
            <SiGitee className="w-4 h-4" />
          </div>
          <span className="text-sm truncate">Gitee</span>
          <ExternalLink className="w-3.5 h-3.5 ml-auto" />

        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 p-2.5 rounded-lg transition-all ${theme === 'light'
            ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
        >
          <div className={`p-1.5 rounded-lg ${theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-800 text-gray-300'}`}>
            <Github className="w-4 h-4" />
          </div>
          <span className="text-sm">GitHub</span>
          <ExternalLink className="w-3.5 h-3.5 ml-auto" />
        </a>
      </div>

    </div>
  )

}