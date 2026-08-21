"use client";
// 杂项页面组件 - 展示说说内容和时间线
import NextRouter from "@/components/layout/NextRouter";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import Title from "@/components/ui/public/title";
import { api_miscellaneous } from "@/hooks/miscellaneous/api_miscellaneous";
import React, { useEffect, useState } from "react";
import { MiscellaneousTimeline } from "@/components/features/miscellaneous/MiscellaneousTimeline";
import { RotatingCube } from "@/components/features/mol/RotatingCube";
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { ArrowUpIcon } from "lucide-react";
import { Miscellaneous } from "@/types/miscellaneous/type";
import { useT } from "@/i18n/LocaleContext";

export default function MiscellaneousPage() {
  const t = useT();

  const [miscellaneous, setMiscellaneous] = useState<Miscellaneous[]>([])

  useEffect(() => {
    const fetchMiscellaneous = async () => {
      try {
        const res = await api_miscellaneous.getMiscellaneousList()
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
        <main aria-labelledby="miscellaneous-title">
          {/* 说说内容区域 */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen max-w-5xl mx-auto pt-28" aria-label="说说时间线">
            <header>
              <Title>{t('miscellaneous.pageTitle')}</Title>
            </header>
            {miscellaneous.length > 0 ? (
              <MiscellaneousTimeline items={miscellaneous} />
            ) : (
              <section className="flex flex-col justify-center items-center " aria-live="polite" aria-busy="true">
                <RotatingCube />
                <p className="text-lg font-medium text-muted-foreground">{t('miscellaneous.loading')}</p>
              </section>
            )}
          </section>
        </main>
      </NextRouter>
      <footer
        className="fixed bottom-[3%] left-[3%] "
      >
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          variant="outline"
          aria-label={t('common.backToTop')}
          className="border-border bg-card/90 text-foreground"
        >
          <span className="hidden md:inline-block">{t('common.backToTop')}</span>
          <ArrowUpIcon aria-hidden="true" />
        </Button>
      </footer>
    </TechBackgroundNoGrid>
  );
}
