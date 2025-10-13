import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/shadcnComponents/button"
import { Card, CardContent } from "@/components/ui/shadcnComponents/card"
import { Input } from "@/components/ui/shadcnComponents/input"
import { Label } from "@/components/ui/shadcnComponents/label"

import LoginFromImg from '../../../../../public/loginImage/LoginForm.jpg'
import Image from 'next/image'
import { useState } from "react"
import { useRouter } from "next/navigation"
import GitHubLoginButton from "@/components/ui/auth/GitHubLoginButton"
import { auth } from "../../../../../auth"



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
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin(e as unknown as React.FormEvent)
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
                {/* <div className="grid gap-3">
                  <Label htmlFor="email">账号</Label>
                  <Input
                    id="user"
                    type="text"
                    placeholder=""
                    required
                    className="cursor-target"
                    onChange={(e) => setUser(e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={user}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">密码</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={password}
                    className="cursor-target"
                  />
                </div> */}

                {/* <Button type="submit" className="w-full cursor-target" disabled={isLoading}>
                  {isLoading ? '登录中' : '登录'}
                </Button> */}
              </div>
            </form>
              <div className="flex flex-col items-center text-center pb-6">
                {/* <span className="text-muted-foreground py-2">或者你可以使用--</span> */}
                <div>
                  <GitHubLoginButton />
                </div>
              </div>

          </div>

          <div className="bg-muted relative hidden md:block">
            <Image
              src={LoginFromImg}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
