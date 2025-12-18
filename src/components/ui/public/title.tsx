import type React from "react"
import type { Children } from "./background_img"


const Title = ({children,className}:{children:React.ReactNode,className?:string}) => {
  return (
    <div>
        <div className="text-center mb-12">
        <h1 className={`text-[clamp(1.4rem,4vw,2rem)] 
        font-light 
        text-gray-700 dark:text-foreground
        ${className || ''}`}>
          {children}
        </h1>
        <div className="w-24 h-1 bg-blue-400 mx-auto mt-4 rounded-full opacity-70"></div>
      </div>
    </div>
  )
}

export default Title