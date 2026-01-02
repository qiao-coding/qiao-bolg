'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/shadcnComponents/forms/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcnComponents/data-display/card"
import { Input } from "@/components/ui/shadcnComponents/forms/input"
import { Label } from "@/components/ui/shadcnComponents/forms/label"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function LoginFormAdmin({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async(e:React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const res=await fetch('/api/adminLogin',{
        method:'POST',
        credentials:'include',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({username:user,password:password}),
      })
      const data = await res.json()
      if(res.ok&& data.success){
        window.dispatchEvent(new Event('authChange'))
        
        const urlParams = new URLSearchParams(window.location.search)
        const redirectPath = urlParams.get('redirect') || '/admin'
        
        router.push(redirectPath);
        router.refresh()
      }else{
        throw new Error(data.error||'Failed to fetch LoginRes');
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
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">后台管理登录</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">账号</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="请输入账号"
                    required
                    className="cursor-target"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">密码</Label>
                    {/* <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a> */}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    className="cursor-target"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <Button type="submit" className="w-full cursor-target">
                {isLoading? '登录中...':'登录'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

    </div>
  )
}
