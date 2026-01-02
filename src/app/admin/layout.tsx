import ThemePage from "@/components/ui/public/themePage";
import {
  Breadcrumb,
  BreadcrumbList,

} from "@/components/ui/shadcnComponents/navigation/breadcrumb"
import { Separator } from "@/components/ui/shadcnComponents/navigation/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/shadcnComponents/navigation/sidebar"
import React from "react";
import { auth } from "../../../auth";
import { RotatingCube } from "@/components/features/mol/RotatingCube";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AppAdminSidebar from "@/components/features/admin/appAdmin_Sidebar";



export default async function AdminLayout({ children }: { children: React.ReactNode }) {

  const session = await auth();

  const adminInfo = await (async () => {
    try {
      if (!session?.user?.email) {
        return null;
      }

      const adminUser = await prisma.adminUser.findUnique({
        where: {
          username: session.user.email
        }
      });



      if (adminUser) {

        return true;
      }
      return null
    } catch (err) {
      throw new Error('获取管理员信息失败');
    }
  })();


  const adminUserCheck = await prisma.adminUser.findUnique({
    where: {
      username: session?.user?.email ?? undefined
    }
  })

  const yanzheng = adminUserCheck?.isDynamicEmail
    ? !session || !adminInfo : !session



  if (yanzheng) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-100 dark:bg-slate-800">
        <div className="flex flex-col justify-center items-center ">
          <RotatingCube />
          <p className="text-3xl text-sky-400 dark:text-white font-bold">
            可能是权限不足或者网络波动，请返回主页重试！
          </p>
          <div className="flex mt-7 justify-center items-center gap-5">
            <Link
              href="/"
              className="text-sky-400 dark:text-white font-bold mt-4
              hover:text-sky-600 dark:hover:text-sky-300"
            >返回主页</Link>
          </div>

        </div>
      </div>
    )

  }


  return (
    <SidebarProvider className="bg-sky-100/40  dark:bg-slate-600/40">
      <AppAdminSidebar />
      <SidebarInset className=" text-foreground">
        <header className="flex absolute  justify-between  items-center gap-2 border-b border-border">
          <div className="flex  shrink-0 top-0 fixed w-full h-16 z-2 
          items-center flex-2 px-4 bg-sky-200/60 
           dark:bg-slate-600/40  ">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 "
            />

            {/* 面包屑导航 */}
            <Breadcrumb className="fixed top-5 right-10">
              <BreadcrumbList>
                <div className="">
                  <ThemePage />
                </div>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="min-h-screen mt-15">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
