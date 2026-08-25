import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/shadcnComponents/data-display/card"
import Image from 'next/image'
import { SignIn } from "../auth/Github_signIn"



export function LoginForm({
  locale,
  className,
  ...props
}: React.ComponentProps<"div"> & { locale: string }) {






  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden rounded-lg border-border/70 bg-card/95 p-0 shadow-sm">
        <CardContent className="grid p-0 md:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6 p-6 text-left md:p-8">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-blue-deep">Welcome back</p>
              <h1 className="text-2xl font-semibold text-foreground">登录 小小乔の小站</h1>
              <p className="text-sm leading-6 text-muted-foreground">
                使用 GitHub 账号继续阅读、管理你的内容和后台设置。
              </p>
            </div>
            <div className="w-full">
              <SignIn redirectTo={`/${locale}`} />
            </div>
          </div>

          <div className="relative hidden min-h-72 bg-muted md:block">
            <Image
              src='/login_img/LoginForm.jpg'
              alt="Login illustration"
              width={500}
              height={500}
              className="absolute inset-0 h-full w-full object-cover opacity-90 dark:brightness-[0.55] dark:grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/35 to-transparent" />
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
