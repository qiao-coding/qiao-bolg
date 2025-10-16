'use client'
import type React from "react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Children } from "../public/background_img"


const Title:React.FC<Children> = ({children}) => {
    const{resolvedTheme}=  useTheme()
    const[isDark,setIsDark]= useState(true)
    const[mounted,setmounted]=useState(false)


    useEffect(()=>{
      setmounted(true)
    },[isDark])
    useEffect(()=>{
      if(resolvedTheme&&mounted){
        setIsDark(resolvedTheme==='dark')
      }else{
        setIsDark(resolvedTheme==='light')
      }
    },[resolvedTheme,mounted])
  return (
    <div>
        <div className="text-center mb-12">
        <h1 className={!isDark
        ?"text-[clamp(1.4rem,4vw,2rem)] font-light text-gray-700 tracking-wide"
        :'text-[clamp(1.4rem,4vw,2rem)] font-light text-white tracking-wide'}>
          {children}
        </h1>
        <div className="w-24 h-1 bg-blue-400 mx-auto mt-4 rounded-full opacity-70"></div>
      </div>
    </div>
  )
}

export default Title