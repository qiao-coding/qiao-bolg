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
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, X } from "lucide-react"

export function LoginFormAdmin({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const router = useRouter()

  const handleLogin = async(e:React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    setError(null)
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
        
        router.push('/admin');
        router.refresh()
      }else{
        throw new Error(data.error||'登录失败，请检查账号和密码');
      }
    } catch (error) {
      setIsLoading(false)
      const errorMessage = error instanceof Error ? error.message : '登录失败，请稍后重试'
      setError(errorMessage)
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 600)
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
      {/* 登录表单 */}
      <motion.div
        animate={isShaking ? {
          x: [0, -10, 10, -10, 10, -5, 5, 0],
        } : {}}
        transition={{ duration: 0.6 }}
      >
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
                  <Button type="submit" className="w-full cursor-pointer cursor-target" disabled={isLoading}>
                  {isLoading? '登录中...':'登录'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* 错误消息动画 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <motion.div
              initial={{ backgroundColor: "rgb(239, 68, 68)" }}
              animate={{ 
                backgroundColor: ["rgb(239, 68, 68)", "rgb(248, 113, 113)", "rgb(239, 68, 68)"]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="flex items-center gap-3 p-4 rounded-lg bg-red-500 text-white shadow-lg"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              </motion.div>
              <span className="text-sm font-medium">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto hover:bg-red-600 rounded p-1 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
       
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
