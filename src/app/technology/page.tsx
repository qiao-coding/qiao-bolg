'use client'

import NextRouter from "@/components/layout/NextRouter";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import AnimatedContent from "@/components/ui/shadcnComponents/AnimatedContent";
import { RootState } from "@/lib/store";
import React from "react";
import { useSelector } from "react-redux";

const Technology = () => {

 const TechnicalRoute = useSelector((state:RootState)=>state.Tech.fristTechnology)


  return (
   
      
   <TechBackgroundNoGrid>
    <NextRouter>
    <AnimatedContent
          distance={150}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={1}
          threshold={0.1}
        >
    <article className="py-12 px-4 md:px-8 pt-18 min-h-screen">
     
      <Title>
        个人路线一览
      </Title>

     
      <div className="max-w-4xl mx-auto">
        <ul className="timeline timeline-vertical relative">
      
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-100 -translate-x-1/2"></div>
          
          {TechnicalRoute.map((route, index) => (
            <li key={route.id} className="relative mb-10 last:mb-0">
      
              <div className={`timeline-${index % 2 === 0 ? 'start' : 'end'} pr-6 md:pr-12 pl-4`}>
                <div 
                  className={`p-5 rounded-lg shadow-sm bg-white transition-all duration-300 hover:shadow-md
                             ${index % 2 === 0 
                               ? 'border-l-4 border-blue-500' 
                               : 'border-r-4 border-blue-400'
                             }`}
                >
                  <div className={`text-xs font-medium px-2.5 py-1 rounded-full mb-2 
                                 ${index % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-blue-50 text-blue-500'}`}>
                    {route.period}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{route.content}</p>
                  <div className={`mt-2 text-xs text-gray-500 
                                 ${index % 2 === 0 ? 'text-blue-500' : 'text-blue-400'}`}>
                   
                  </div>
                </div>
              </div>
              
   
              <div className="timeline-middle">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center shadow
                  ${index % 2 === 0 ? 'bg-blue-500' : 'bg-blue-400'}
                  hover:scale-110 transition-transform
                `}>
                  <span className="text-white text-xs">{index + 1}</span>
                </div>
              </div>
            </li>
          ))}
          
       
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-20px] flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mt-2">持续探索,不断进步</p>
          </div>
        </ul>
      </div>
    </article>
    </AnimatedContent>
    </NextRouter>
    </TechBackgroundNoGrid>
  
  );
};

export default Technology;