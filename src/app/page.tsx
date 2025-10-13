"use client";
import up from "../../public/UserImage/up.jpg";
import { VscGithub } from "react-icons/vsc";
import NextRouter from "@/components/layout/NextRouter";
import AnimatedContent from "@/components/ui/shadcnComponents/AnimatedContent";
import { SiGitee, SiTiktok } from "react-icons/si";
import { FaBilibili } from "react-icons/fa6";
import { SiKuaishou } from "react-icons/si";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FaAngleDoubleDown } from "react-icons/fa";
import HomeArticles from "@/components/features/home/HomeArticles";
import TiltedCard from "@/components/ui/shadcnComponents/TiltedCard";

export default function Home() {
  const{resolvedTheme}=  useTheme()
    const[isDark,setIsDark]= useState(true)
    const[mounted,setmounted]=useState(false)


    useEffect(()=>{
      setmounted(true)
    },[])
    useEffect(()=>{
      if(resolvedTheme){
        setIsDark(resolvedTheme==='dark')
      }else{
        setIsDark(resolvedTheme==='light')
      }
    },[resolvedTheme])

    if(!mounted){
      return<div className={`h-screen bg-cover homebg bg-center bg-no-repeat  to-white p-6`}></div>
    }

  return (
    <>
      <div className="min-h-screen bg-cover bg-center">
        <NextRouter>
          <div className={`min-h-screen bg-cover homebg bg-center bg-no-repeat  to-white `}>
            <div className={`${!isDark?'':'bg-black/60 min-h-screen bg-cover'} p-6 `}>
            <AnimatedContent
              distance={150}
              direction="vertical"
              reverse={false}
              duration={1.2}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              scale={1}
              threshold={0.1}
              delay={0}
            >
              <div className="hero  min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse gap-22 ">
                  <div className="cursor-target">
                    <TiltedCard
                      imageSrc={up.src}
                      captionText=""
                      containerHeight="200px"
                      containerWidth="200px"
                      imageHeight="200px"
                      imageWidth="200px"
                      rotateAmplitude={12}
                      scaleOnHover={1.1}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={true}
                      // overlayContent={
                      //   <p className="tilted-card-demo-text">
                      //     Kendrick Lamar - GNX
                      //   </p>
                      // }
                    />
                  </div>
                  <div>
                    <h1 className="mt-2 text-5xl font-bold text-center">
                      Hi! HaoWhite
                    </h1>

                    <p className="py-6">愿生活的每一天，都有惊喜!</p>
                    <div className="flex gap-10 justify-center">
                      <a 
                      href="https://v.douyin.com/lR3mAhJJvlE/ 7@5.com :9pm"
                      >
                        <SiTiktok className="btn hover:btn-neutral hover:text-white fill-current text-4xl  p-2 cursor-target mt-2" />
                      </a>
                      <a
                      href="https://b23.tv/yrKBRWO">
                        <FaBilibili className="fill-current text-3xl p-2 btn btn-soft btn-secondary cursor-target mt-2" />
                      </a>
                      <a
                      href="https://gitee.com/xier123456">
                        <SiGitee className="fill-current text-3xl btn btn-soft btn-error p-2 hover:text-white cursor-target mt-2" />
                      </a>
                      <a>
                      <VscGithub className="btn bg-black border-0 text-white   border-black p-0 p-2 cursor-target mt-2 " />
                     </a>
                    </div>
                  </div>
                  
                </div>
              </div>
            </AnimatedContent>
            <div className="flex justify-center -mt-24 relative z-10 relative bottom-15 text-center">
              <button
                onClick={() => {
                  const articlesSection = document.getElementById('articles-section');
                  if (articlesSection) {
                    articlesSection.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
                className="group cursor-target transform transition-all duration-300 hover:scale-110"
                aria-label="滚动到文章部分"
              >
                <p className={`
                ${isDark
                ?'text-white'
                :'text-black/70'
                }
                text-sm mt-3 text-center font-medium drop-shadow-lg pb-3`
                }>
                  查看文章
                  
                </p>
                <span className={`
                ${isDark
                ?'text-white/70'
                :'text-black/70'
                }
                  text-4xl relative left-2 `
                }>
                    <FaAngleDoubleDown />
                  </span>
              </button>
            </div>
            </div>
                      </div>
            
            {/* 文章部分 */}
            <div id="articles-section" className={`${isDark?'bg-gray-900/60':'bg-white/70'}  backdrop-blur-sm py-16`}>
              <HomeArticles />
            </div>
          </NextRouter>
        </div>
      </>
    );
}
