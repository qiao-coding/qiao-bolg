"use client";
import NextRouter from "@/components/layout/NextRouter";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import { useMiscellaneous } from "@/hooks/miscellaneous/useMiscellaneous";
import { miscellaneousType } from "@/types/miscellaneous/type";
import React, { useEffect, useState } from "react";
import { MiscellaneousTimeline } from "@/components/features/miscellaneous/MiscellaneousTimeline";
import { RotatingCube } from "@/components/features/mol/RotatingCube";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { ArrowUpIcon } from "lucide-react";
import { motion } from "framer-motion";




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
  }, [miscellaneous.length])



  return (
    <TechBackgroundNoGrid>
      <NextRouter>
        <motion.div
          initial={{ opacity: 0, y: 150, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
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

        </motion.div>
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