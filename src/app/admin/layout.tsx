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
import { getSession } from "next-auth/react";
import React from "react";
import { auth } from "../../../auth";
import { RotatingCube } from "@/components/features/mol/RotatingCube";
import Link from "next/link";



export default async function AdminLayout({ children }: { children: React.ReactNode }) {

  const session = await auth(); // 服务端获取当前登录用户信息

  if (!session) {
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
                  <ThemePage />
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
