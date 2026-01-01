"use client";
import NextRouter from "@/components/layout/NextRouter";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import AnimatedContent from "@/components/ui/shadcnComponents/AnimatedContent";
import { useMiscellaneous } from "@/hooks/miscellaneous/useMiscellaneous";
import { miscellaneousType } from "@/types/miscellaneous/type";
import React, { useEffect, useState } from "react";
import { MiscellaneousTimeline } from "@/components/features/miscellaneous/MiscellaneousTimeline";
import { RotatingCube } from "@/components/features/mol/RotatingCube";
import PageNavigation from "@/components/features/notes/PageNavigation";
import { Button } from "@/components/ui/shadcnComponents/button";
import { ArrowUpIcon } from "lucide-react";




const Miscellaneous = () => {

  const [miscellaneous, setMiscellaneous] = useState<miscellaneousType[]>([])

  useEffect(() => {
    const fetchMiscellaneous = async () => {
      try {
        const res = await useMiscellaneous.getMiscellaneousList()
        const data = res.reverse()
        setMiscellaneous(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchMiscellaneous()
  }, [])



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
            {miscellaneous.length > 0 ? (
              <MiscellaneousTimeline items={miscellaneous} />
            ) : (
              <div className="flex flex-col justify-center items-center ">
                <RotatingCube />
                <p className="text-3xl text-sky-400 dark:text-white font-bold">正在加载说说...</p>
              </div>
            )}


          </article>

        </AnimatedContent>
      </NextRouter>
      <footer
        className="fixed bottom-[3%] left-[3%] "
      >
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          variant="outline"
          aria-label="Submit"
          className="bg-card/60"

        >
          <span className="hidden md:inline-block">返回上级</span>

          <ArrowUpIcon />
        </Button>
      </footer>
    </TechBackgroundNoGrid>
  );
};

export default Miscellaneous;
