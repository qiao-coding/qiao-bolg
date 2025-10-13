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
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/shadcnComponents/sidebar"
import { NavProjects } from "@/components/ui/admin/nav-projects"
import { NavUser } from "@/components/ui/admin/nav-user"

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
      url: "/admin/study-nodes",
      icon: PieChart,
    },
    {
      name: "用户管理",
      url: "/admin/user-management",
      icon: Bot,
    },
  ],
}

// AppSidebar 组件定义
function AppSidebar() {

  const[userData, setUserData]=React.useState<{
    name: string
    username: string
    avatar: string
  }>()
  React.useEffect(()=>{
    const userData=JSON.parse(localStorage.getItem('user')||'{}')
    setUserData(userData)
  },[])
  return (
    <Sidebar side="left" className="bg-sidebar text-sidebar-foreground border-sidebar-border">
      <SidebarContent className="flex flex-col gap-2">
        <div className="flex items-center justify-center p-4 border-b border-sidebar-border">
          <GalleryVerticalEnd className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-xl font-bold">管理后台</h1>
        </div>
        {typeof window === 'undefined' ? (
          <NavProjects projects={data.projects} />
        ) : (
          <NavProjects projects={data.projects} />
        )}
      </SidebarContent>
      {userData&&<NavUser user={userData}/>}

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="text-xs text-muted-foreground text-center">
          后台管理系统
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export { AppSidebar }
