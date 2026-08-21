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
    isDynamicEmail: true,
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
        return <Github className="w-4 h-4 text-brand-blue-deep" />;
      case 'gitee':
        return <SiGitee className="w-4 h-4 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400" />;
      default:
        return <div className="w-4 h-4 text-brand-blue-deep flex items-center justify-center text-xs">{name.charAt(0)}</div>;
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
    rounded-lg border border-border/70 bg-card/85 p-6 shadow-sm sticky top-24 self-start">
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-5">
          <div className="w-32 h-32 rounded-lg overflow-hidden border border-border bg-muted shadow-sm">
            <Image
              src={session?.user?.image || "/user_img/up.jpg"}
              alt="个人头像"
              width={128}
              height={128}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h1 className="text-xl font-bold mb-1 text-foreground">
          {handleDynamicName()}
        </h1>
        <p className="text-sm text-muted-foreground">
          {handleDynamicEmail()}
        </p>
      </div>

      <div className="space-y-3 mb-6" >

        <h3 className="text-base font-semibold mb-3 text-foreground">联系方式</h3>
        {sidebarData.socialLinks.map((item, index) => (

          <a
            key={index}
            href={item.link}

            className="flex items-center gap-2 p-2.5 rounded-md transition-colors bg-brand-blue-soft/60 text-foreground hover:bg-brand-blue-soft"
          >
            <div className="p-1.5 rounded-md">
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
