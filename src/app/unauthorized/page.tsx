'use client'

import { Button } from "@/components/ui/shadcnComponents/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Unauthorized() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">页面未找到</h2>
        <p className="mt-2 text-muted-foreground">
          抱歉，您访问的页面不存在或您没有权限访问此页面。
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button onClick={() => router.back()}>
            返回上一页
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">回到首页</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}