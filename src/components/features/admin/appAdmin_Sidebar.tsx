"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  Leaf,
  LinkIcon,
  MessageCircle,
  NotebookTabs,
  PieChart,
  SettingsIcon,
  UserCog2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/shadcnComponents/navigation/sidebar"
import { NavProjects } from "@/components/ui/admin/nav-projects"
import { NavUser } from "@/components/ui/admin/nav-user"
import { useT } from "@/i18n/LocaleContext";

// AppSidebar 组件定义
export default function AppAdminSidebar() {
  const t = useT();
  const data = {
    user: {
      name: t('admin.admin'),
      username: "admin@example.com",
      avatar: "/avatars/admin.jpg",
    },
   projects: [
      {
        name: t('admin.dashboard'),
        url: "/admin",
        icon: PieChart,
      },
      {
        name: t('admin.notesManagement'),
        url: "/admin/notes",
        icon: NotebookTabs,
      },
      {
        name: t('admin.miscellaneousManagement'),
        url: '/admin/miscellaneous',
        icon: MessageCircle,
      },
      {
        name: t('admin.friendLinksManagement'),
        url: '/admin/friend-links',
        icon: LinkIcon,
      },
      {
        name: t('admin.aboutSettings'),
        url: '/admin/about',
        icon: Leaf,
      },
      {
        name: t('admin.blogSettings'),
        icon: SettingsIcon,
        url: '/admin/blog',
      },
      {
        name: t('admin.adminSettings'),
        url: '/admin/admin-settings',
        icon: UserCog2,
      }
    ],
  }

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
            {t('admin.panelTitle')}
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

