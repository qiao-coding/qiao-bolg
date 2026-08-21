import React from "react";
import { auth } from "../../../../auth";
import { RotatingCube } from "@/components/features/mol/RotatingCube";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { zh } from '@/i18n/dictionaries';
import { AIChatWidget } from '@/components/features/ai-assistant/AIChatWidget';
import { AppAdminHeader } from "@/components/features/admin/AppAdminHeader";



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
      throw new Error('获取管理员信息失败', { cause: err });
    }
  })();


  const adminUserCheck = session?.user?.email
    ? await prisma.adminUser.findUnique({
        where: { username: session.user.email }
      })
    : null

  const yanzheng = adminUserCheck?.isDynamicEmail
    ? !session || !adminInfo : !session



  if (yanzheng) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-paper text-foreground">
        <div className="flex flex-col items-center justify-center">
          <RotatingCube />
          <p className="mt-6 text-3xl font-bold text-brand-blue-deep dark:text-[#dbe9f8]">
            {zh.admin.permissionDenied}
          </p>
          <Link
            href="/"
            className="mt-7 text-brand-blue-deep dark:text-[#dbe9f8] font-bold hover:text-brand-pink-deep dark:hover:text-[#ffddec]"
          >{zh.common.backToHome}</Link>
        </div>
      </div>
    )

  }


  return (
    <div className="min-h-screen w-full bg-brand-paper text-foreground">
      <div className="blog-theme-bg relative min-h-screen w-full overflow-hidden">
        <div className="blog-theme-decor pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,132,189,0.045)_1px,transparent_1px),linear-gradient(rgba(255,132,189,0.035)_1px,transparent_1px)] bg-[size:40px_40px] opacity-45 dark:bg-[linear-gradient(90deg,rgba(185,215,242,0.045)_1px,transparent_1px),linear-gradient(rgba(185,215,242,0.035)_1px,transparent_1px)] dark:opacity-35" />
        <div className="relative">
          <AppAdminHeader />
          <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
            {children}
          </main>
          <AIChatWidget />
        </div>
      </div>
    </div>
  )
}
