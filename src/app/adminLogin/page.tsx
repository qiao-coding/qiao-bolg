'use client'
import { LoginFormAdmin } from "@/components/features/admin/login-from-admin";
import { useBlogDataContext } from "@/components/layout/BlogDataProvider";
import ThemePage from "@/components/ui/public/themePage";
import Link from "next/link";

import { useEffect, useState } from "react";
import { FaLeftLong } from "react-icons/fa6";

export default function LoginPage() {
  const [mounted, setMounted] = useState<boolean>(false)
  const { blogData } = useBlogDataContext();

  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <section className="bg-sky-100/60 dark:bg-gray-700 flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
     <nav className="fixed top-5 flex items-center px-6 justify-between w-full gap-2  z-50">
      <Link href="/" className=" flex items-center gap-2 font-medium text-black dark:text-white"> 
      <FaLeftLong/>
      返回主页
      </Link>
        <ThemePage />
      </nav>
      <div className="flex w-full max-w-sm flex-col gap-6">

        <header className="flex items-center gap-2 
        self-center font-medium text-black dark:text-white">

          <span className="text-sky-400 font-semibold">
            {blogData?.blogName || 'HaoWhite'}
          </span>
          管理后台
        </header>
        {mounted && <LoginFormAdmin />}
      </div>
    </section>
  )
}
