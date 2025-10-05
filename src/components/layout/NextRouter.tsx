'use client'
import React, { ReactNode} from 'react'
import Header from './Header'
import Footer from './Footer'



interface LRouter{
   children:ReactNode
   showHeader?:boolean
   showFooter?:boolean
}

const NextRouter = ({children,showHeader=true,showFooter=true}:LRouter) => {

  return (
    <div>
      {showHeader?<Header/>:''}
      {children}
      {showFooter?<Footer/>:''}
    </div>
  )
}

export default NextRouter