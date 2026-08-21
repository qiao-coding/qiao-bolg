'use client'
import { LoginFormAdmin } from "@/components/features/admin/login-from-admin";
import { useBlogDataContext } from "@/components/layout/BlogDataProvider";
import ThemePage from "@/components/ui/public/themePage";
import { Link } from "@/i18n/navigation";

import { useEffect, useState } from "react";
import { FaLeftLong } from "react-icons/fa6";

import { useT } from '@/i18n/LocaleContext';

export default function LoginPage() {
  const t = useT();
  const [mounted, setMounted] = useState<boolean>(false)
  const { blogData } = useBlogDataContext();

  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <section className="bg-gradient-to-b from-sky-50/80 via-white/60 to-pink-50/80 dark:from-slate-900/90 dark:via-slate-800/90 dark:to-slate-900/90 flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
     <nav className="fixed top-5 flex items-center px-6 justify-between w-full gap-2  z-50">
      <Link href="/" className=" flex items-center gap-2 font-medium text-foreground">
      <FaLeftLong/>
      {t('common.backToHome')}
      </Link>
        <ThemePage />
      </nav>
      <div className="flex w-full max-w-sm flex-col gap-6">

        <header className="flex items-center gap-2
        self-center font-medium text-foreground">

          <span className="text-brand-blue dark:text-brand-pink font-semibold">
            {blogData?.blogName || 'xiaoxiaoqiao'}
          </span>
          {t('admin.adminLogin')}
        </header>
        {mounted && <LoginFormAdmin />}
      </div>
    </section>
  )
}
