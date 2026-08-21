import type React from "react"


const Title = ({children,className}:{children:React.ReactNode,className?:string}) => {
  return (
    <div>
        <div className="text-center mb-12">
        <h1 className={`text-[clamp(1.5rem,4vw,2.15rem)]
        font-semibold
        text-foreground
        ${className || ''}`}>
          {children}
        </h1>
        <div className="mx-auto mt-4 h-px w-20 bg-brand-blue/55"></div>
      </div>
    </div>
  )
}

export default Title
