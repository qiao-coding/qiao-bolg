"use client";
import NextRouter from "@/components/layout/NextRouter";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import AnimatedContent from "@/components/ui/shadcnComponents/AnimatedContent";
import { useMiscellaneous } from "@/hooks/miscellaneous/useMiscellaneous";
import { miscellaneousType } from "@/types/miscellaneous/type";
import React, { useEffect, useState } from "react";
import { MiscellaneousTimeline } from "@/components/features/miscellaneous/MiscellaneousTimeline";




const Miscellaneous = () => {

  const [miscellaneous,setMiscellaneous] = useState<miscellaneousType[]>([])

  useEffect(()=>{
    const fetchMiscellaneous=async()=>{
      try {
        const res=await useMiscellaneous.getMiscellaneousList()
        setMiscellaneous(res)
      } catch (error) {
        console.log(error)
      }
    }
    fetchMiscellaneous()
  },[])



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
          <MiscellaneousTimeline items={miscellaneous} />
        </article>
        </AnimatedContent>
      </NextRouter>
    </TechBackgroundNoGrid>
  );
};

export default Miscellaneous;
