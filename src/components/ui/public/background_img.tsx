"use client"
import { useTheme } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";
import type React from "react";
interface Children{
  children:ReactNode
}

const TechBackgroundNoGrid:React.FC<Children> = ({children}) => {
   const{resolvedTheme}=  useTheme()
  const[isDark,setIsDark]= useState(false)
  const [mounted, setMounted] = useState(false);

  useEffect(()=>{
    setMounted(true)
  },[])
  useEffect(()=>{
    if(resolvedTheme){
      setIsDark(resolvedTheme==='light')
    }else{
      setIsDark(resolvedTheme==='dark')
      
    }
  },[resolvedTheme])

  if(!mounted){
    return( 
    <div
     style={{
      backgroundImage: `url(/bg.webp)`,
      backgroundAttachment:'fixed',
     }}
     className="h-screen bg-cover  bg-center">
    <div className={
      resolvedTheme==='light'
    ?"relativept-30  transition-colors duration-300 min-h-screen bg-white/60"
    :"relativept-30  transition-colors duration-300 min-h-screen bg-black/60 "}
    ></div>
    </div>
    )
  }



  return (
    <div 
    style={{
      backgroundImage: `url(/bg.webp)`,
      backgroundAttachment:'fixed',
    }}
    className="h-full bg-cover bg-center background-attachment">
    <div  className={` 
      ${isDark
    ?"relativept-30  transition-colors duration-300 h-full w-full bg-white/60"
    :"relativept-30  transition-colors duration-300 h-full w-full bg-black/60 "}`}>
      {children}
    </div>
    </div>
  );
};


export type{ Children }

export default TechBackgroundNoGrid;
