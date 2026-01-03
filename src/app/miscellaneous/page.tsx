"use client";
// 杂项页面组件 - 展示说说内容和时间线
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
import PageNavigation from "@/components/features/notes/PageNavigation";

export default function MiscellaneousPage() {

  const [miscellaneous, setMiscellaneous] = useState<miscellaneousType[]>([])

  useEffect(() => {
    const fetchMiscellaneous = async () => {
      try {
        const res = await useMiscellaneous.getMiscellaneousList()
        const data = res.reverse()
        setMiscellaneous(data)
      } catch (error) {
        throw error
      }
    }
    fetchMiscellaneous()
  }, [miscellaneous.length])

  return (
    <TechBackgroundNoGrid>
      <NextRouter>
        <motion.main
          initial={{ opacity: 0, y: 150, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          aria-labelledby="miscellaneous-title"
        >
          {/* 说说内容区域 */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen max-w-5xl mx-auto pt-28" aria-label="说说时间线">
            <header>
              <Title>说说</Title>
            </header>
            {miscellaneous.length > 0 ? (
              <MiscellaneousTimeline items={miscellaneous} />
            ) : (
              <section className="flex flex-col justify-center items-center " aria-live="polite" aria-busy="true">
                <RotatingCube />
                <p className="text-3xl text-sky-400 dark:text-white font-bold">正在加载说说...</p>
              </section>
            )}
          </section>
        </motion.main>
      </NextRouter>
      <footer
        className="fixed bottom-[3%] left-[3%] "
      >
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          variant="outline"
          aria-label="返回顶部"
          className="bg-card/60 text-black dark:text-white"
        >
          <span className="hidden md:inline-block">返回顶部</span>
          <ArrowUpIcon aria-hidden="true" />
        </Button>
      </footer>
    </TechBackgroundNoGrid>
  );
}