"use client";

import NextRouter from "@/components/layout/NextRouter";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import AnimatedContent from "@/components/ui/shadcnComponents/AnimatedContent";
import { RootState } from "@/lib/store";
import React from "react";
import { useSelector } from "react-redux";

const Miscellaneous = () => {
  const MisceUp = useSelector(
    (state: RootState) => state.Misce.fristMiscellaneous
  )
//   const [HeaderStyle,setHeaderStyle] =useState(true)
//  const lastScrollTop = useRef(0)

// type ThrottleFunction<T extends any[]>=(...args:T)=>void

//  const throttle=<T extends any[]>(
//   func:ThrottleFunction<T>,
//   limit:number
// )=>{
//   let lastFunc=Reaturn;
//   let lastRan=0;

//   return function(){
//     const context = this;
//     const args = arguments;
//     if(!lastRan){
//       func.apply(context,args);
//       lastRan=Date.now();
//     }else{
//       clearTimeout(lastFunc)
//       lastFunc =setTimeout(()=>{
//         if(Date.now()-lastRan>=limit){
//           func.apply(context,args);
//           lastRan=Date.now();
//         }
        
//       },
//     limit-(Date.now()-lastRan))
//     }
//   }
// }
//   useEffect(()=>{
//     const handleScroll=()=>{
//       const scrollTop = window.scrollY

//       if(scrollTop>150&&scrollTop>lastScrollTop.current){
//         setHeaderStyle(false)
//       }else{
//         setHeaderStyle(true)
//       }
//     }
//     lastScrollTop.current= window.scrollY<=0? 0 : window.scrollY

    
//     window.addEventListener("scroll",handleScroll)
//   },[])

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
        <article className="pt-18 min-h-screen">
          <Title>说说</Title>

          {/* 时间线容器 */}
          <div className=" max-w-4xl mx-auto">
            <ul className="timeline timeline-vertical
            
            relative">
              {/* 中间连接线 */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-100 -translate-x-1/2 z-0"></div>

              {MisceUp.map((mis, index) => (
                <li
                  key={mis.MisceUid}
                  className="relative z-10 mb-10 md:mb-16 last:mb-0"
                >
                  {/* 左右交替的内容卡片 */}
                  <div
                    className={`timeline-start pr-8 md:pr-12 pl-4 md:pl-0`}
                  >
                    <div
                      className={`p-6 md:p-8 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md 
                            
                                 bg-white  hover:translate-x-1
                                
                             `}
                    >
                      <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                        {mis.content}
                      </p>

                      {/* 小日期标识（可选） */}
                      <div
                        className={`mt-4 text-xs text-gray-500 ${
                          index % 2 === 0 ? "text-blue-500" : "text-blue-400"
                        }`}
                      >
                        记录于 {mis.date}
                      </div>
                    </div>
                  </div>

                  {/* 中间节点 */}
                  <div className="timeline-middle">
                    <div
                      className={`
                  w-6 h-6 rounded-full flex items-center justify-center shadow-md
                  ${index % 2 === 0 ? "bg-blue-400" : "bg-blue-300"}
                  transition-transform duration-300 hover:scale-125
                `}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="white"
                        className="h-3.5 w-3.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </article>
        </AnimatedContent>
      </NextRouter>
    </TechBackgroundNoGrid>
  );
};

export default Miscellaneous;
