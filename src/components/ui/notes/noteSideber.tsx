import Image from "next/image";
import { SiGitee } from "react-icons/si";
import { ExternalLink, Github } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";


export default function NotesSideber() {

  const { data: session } = useSession();
  const [sidebarData, setSidebarData] = useState({
    name: "昊小白",
    email: "",
    isDynamicName: false,
    isDynamicEmail: false,
    socialLinks: [
      {
        name: "GitHub",
        link: "https://github.com/xier123456",
      },
      {
        name: "Gitee",
        link: "https://xier123456.github.io/",
      },
    ]
  });

  // 页面加载时获取博客设置数据
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch('/api/blog');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '获取数据失败');
        }

        if (data.notesSidebar) {
          setSidebarData(prev => ({
            ...prev,
            name: data.notesSidebar.name || prev.name,
            email: data.notesSidebar.email || prev.email,
            socialLinks: data.notesSidebar.socialLinks || prev.socialLinks,
            isDynamicName: data.notesSidebar.isDynamicName || prev.isDynamicName,
            isDynamicEmail: data.notesSidebar.isDynamicEmail || prev.isDynamicEmail,

          }));
        }
      } catch (error) {
        console.error('获取侧边栏数据失败:', error);
      }
    };

    fetchBlogData();
  }, []);

  // 根据平台名称获取对应的图标组件
  const getIconComponent = (name: string) => {
    switch (name.toLowerCase()) {
      case 'github':
        return <Github className="w-4 h-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300" />;
      case 'gitee':
        return <SiGitee className="w-4 h-4 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400" />;
      default:
        return <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 flex items-center justify-center text-xs">{name.charAt(0)}</div>;
    }
  };

  const handleDynamicName = () => {

    if (!sidebarData.isDynamicName) {
      return sidebarData.name || session?.user?.name || "昊小白";
    } else {
      return session?.user?.name || "昊小白";
    }

  }

  const handleDynamicEmail = () => {

    if (sidebarData.isDynamicEmail) {
      return '';
    } else {
      return sidebarData.email || session?.user?.email || "xier123456@qq.com";
    }
  }

  return (
    <div className="hidden lg:block 
    lg:w-[200px] xl:w-[250px] 
    bg-white dark:bg-gray-800/90
     rounded-2xl shadow-sm dark:shadow-lg dark:shadow-gray-900/20 p-6 sticky top-24 self-start dark:border dark:border-gray-700">
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-5">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg dark:shadow-gray-900/50">
            <Image
              src={session?.user?.image || "/UserImage/up.jpg"}
              alt="个人头像"
              width={128}
              height={128}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          <div className="absolute -inset-1 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow">
          </div>
        </div>

        <h1 className="text-xl font-bold mb-1 text-gray-800 dark:text-white">
          {handleDynamicName()}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {handleDynamicEmail()}
        </p>
      </div>

      <div className="space-y-3 mb-6" >

        <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-white">联系方式</h3>
        {sidebarData.socialLinks.map((item, index) => (

          <a
            key={index}
            href={item.link}

            className="flex items-center gap-2 p-2.5 rounded-lg transition-all bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="p-1.5 rounded-lg">
              {getIconComponent(item.name)}
            </div>
            <span className="text-sm truncate">{item.name}</span>
            <ExternalLink className="w-3.5 h-3.5 ml-auto" />

          </a>
        ))}

      </div>




    </div>
  )

}