"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  User,
  UserCog2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/shadcnComponents/sidebar"
import { NavProjects } from "@/components/ui/admin/nav-projects"
import { NavUser } from "@/components/ui/admin/nav-user"
import { useSession } from "next-auth/react"

// 导航数据
const data = {
  user: {
    name: "管理员",
    username: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  // navMain: [
  //   {
  //     title: "仪表盘",
  //     url: "/admin",
  //     icon: SquareTerminal,
  //     isActive: true,
  //     items: [
  //       {
  //         title: "仪表盘",
  //         url: "/admin/",
  //       },
  //       // {
  //       //   title: "内容概览",
  //       //   url: "/admin/dashboard/content-overview",
  //       // },
  //       // {
  //       //   title: "数据统计",
  //       //   url: "/admin/dashboard/data-statistics",
  //       // },
  //     ],
  //   },
  //   {
  //     title: "用户管理",
  //     url: "/admin/user-management",
  //     icon: Bot,
  //     items: [
  //       {
  //         title: "普通用户",
  //         url: "/admin/user-management/regular-users",
  //       },
  //       {
  //         title: "管理员用户",
  //         url: "/admin/user-management/admin-users",
  //       },
  //       {
  //         title: "评论管理",
  //         url: "/admin/user-management/comment-management",
  //       },
  //     ],
  //   },
  //   {
  //     title: "博客管理",
  //     url: "/admin/blog-management",
  //     icon: BookOpen,
  //     items: [
  //       {
  //         title: "笔记管理",
  //         url: "/admin/blog-management/notes",
  //       },
  //       {
  //         title: "文章编辑",
  //         url: "/admin/blog-management/articles",
  //       },
  //       {
  //         title: "标签管理",
  //         url: "/admin/blog-management/tags",
  //       },
  //     ],
  //   },
  //   {
  //     title: "系统设置",
  //     url: "/admin/system-settings",
  //     icon: Settings2,
  //     items: [
  //       {
  //         title: "基本设置",
  //         url: "/admin/system-settings/basic",
  //       },
  //       {
  //         title: "友链管理",
  //         url: "/admin/system-settings/friend-links",
  //       },
  //     ],
  //   },
  // ],
  projects: [
    {
      name: "仪表盘",
      url: "/admin",
      icon: Frame,
    },
    {
      name: "笔记管理",
      url: "/admin/notes",
      icon: PieChart,
    },
    {
      name: '说说管理',
      url: '/admin/miscellaneous',
      icon: AudioWaveform,
    },
    {
      name: '友链管理',
      url: '/admin/friend-links',
      icon: Map,
    },
    {
      name: '个人设置',
      url: '/admin/about',
      icon: User,
    },
    {
      name: '博客设置',
      url: '/admin/blog',
      icon: Command,
    },
    {
      name:'管理员设置',
      url:'/admin/admin-settings',
      icon:UserCog2,
    }

  ],
}

// AppSidebar 组件定义
export default function AppAdminSidebar() {
  const [userData, setUserData] = React.useState<{
    name: string;
    username: string;
    avatar: string;
  }>();

  React.useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUserData(userData);
  }, []);

  

  return (
    <Sidebar
      side="left"
      className=" backdrop-blur-sm text-slate-100 border-slate-700 shadow-lg bg-sky-200/40  dark:bg-slate-600/40"
    >
      <SidebarContent className="flex flex-col gap-0">
        <div className="flex items-center justify-center
         p-6   bg-sky-200/40  dark:bg-slate-600/40 
        ">
          <GalleryVerticalEnd className="h-7 w-7 mr-3 text-primary" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary 
          to-primary/70 bg-clip-text text-transparent">
            管理后台
          </h1>
        </div>

        <div className="px-3 bg-sky-200/40 h-full dark:bg-slate-600/40">
      
            <NavProjects projects={data.projects} />
          
        </div>
      </SidebarContent>

      {userData && <NavUser user={userData} />}

      <SidebarFooter className="px-3 py-4 bg-sky-200/40 dark:bg-slate-600/40"/>
    </Sidebar>

  );
}

