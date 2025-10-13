'use client'
import { LoginForm } from "@/components/features/home/login/login-form"
import TechBackgroundNoGrid from "@/components/ui/public/background_img"
import { useEffect, useState } from "react"



export default function LoginPage() {

  const[mounted,setMounted] = useState(false)
  useEffect(()=>{
    setMounted(true)
  },[])
  return (
    <TechBackgroundNoGrid>
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        {mounted&&<LoginForm />}
      </div>
    </div>
    </TechBackgroundNoGrid>
  )
}
