import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/shadcnComponents/card"

import Image from 'next/image'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { SignIn } from "../auth/Github_signIn"



export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {


  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: user, password }),

      })
      const data = await res.json()
      if (res.ok && data.success) {
        window.dispatchEvent(new Event('authChange'))
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Failed to fetch LoginRes');
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Login error:', error)
    }
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div>
            <form className="p-6 md:p-8" onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">登录</h1>
                  <p className="text-muted-foreground text-balance">

                  </p>
                </div>
              </div>
            </form>
              <div className="flex flex-col items-center text-center pb-6">
                <div>
                  <SignIn />
                </div>
              </div>

          </div>

          <div className="bg-muted relative hidden md:block">
            <Image
              src='/loginImage/LoginForm.jpg'
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
