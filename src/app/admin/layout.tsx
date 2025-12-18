import { AppSidebar } from "@/components/features/admin/app-sidebar";
import ThemePage from "@/components/ui/public/themePage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/shadcnComponents/breadcrumb"
import { Separator } from "@/components/ui/shadcnComponents/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/shadcnComponents/sidebar"
import React from "react";

// 面包屑导航数据
// const getBreadcrumbs = (pathname: string) => {
//   const segments = pathname.split('/').filter(Boolean);
//   const breadcrumbs = [{ label: '首页', href: '/' }];
  
//   if (segments.length > 0) {
//     breadcrumbs.push({ label: '管理后台', href: '/admin' });
//   }
  
//   if (segments.length > 1) {
//     let currentPath = '/admin';
//     for (let i = 1; i < segments.length; i++) {
//       currentPath += `/${segments[i]}`;
//       breadcrumbs.push({
//         label: segments[i].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
//         href: currentPath
//       });
//     }
//   }
  
//   return breadcrumbs;
// };

export default function AdminLayout({children}: {children: React.ReactNode}) {

  
  return (
    <SidebarProvider className="bg-sky-100/40  dark:bg-slate-600/40">
      <AppSidebar />
      <SidebarInset className=" text-foreground">
        <header className="flex h-16 justify-between bg-sky-200/40  dark:bg-slate-600/40 shrink-0 items-center gap-2 border-b border-border">
          <div className="flex items-center flex-2 px-4  justify-between">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 "
            />
            
            {/* 面包屑导航 */}
            <Breadcrumb>
              <BreadcrumbList>
              <div className="">
              <ThemePage/>
              </div>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="min-h-screen">
         {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
