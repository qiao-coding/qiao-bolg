'use client';
import React, { useState, useEffect } from 'react';
import NextRouter from '@/components/layout/NextRouter';
import TechBackgroundNoGrid from '@/components/ui/public/background_img';
import NotesSideber from '@/components/ui/notes/noteSideber';
import Title from '@/components/ui/public/title';
import { api_about } from '@/hooks/about/api_about';
import { useT } from '@/i18n/LocaleContext';

// 关于页面组件 - 展示个人信息和简介
const AboutPage = () => {
  const t = useT();
  // 个人信息数据
  const [personalInfo, setPersonalInfo] = useState({
    description: "你好！我是昊小白，一名热爱前端开发的前端小白",
    details: [
      { label: "label", value: "value" },
 
    ]
  });

  // 页面加载时获取关于页面数据
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await api_about.getAbout();
        
        setPersonalInfo(response);
      } catch (error) {
        console.error('获取关于页面数据失败:', error);
      }
    };
    
    fetchAboutData();
  }, []);


  return (
    <TechBackgroundNoGrid>
      <NextRouter>
        {/* 页面主内容区域 */}
        <div className="pt-20 pb-16 px-4 min-h-screen">
          {/* 页面标题区域 */}
          <div>
            <div className="max-w-6xl w-full mx-auto mb-16">
              <Title>{t('about.pageTitle')}</Title>
            </div>
          </div>

          {/* 个人信息和侧边栏内容区域 */}
          <div>
            <div className="max-w-6xl w-full mx-auto">
              {/* 主内容和侧边栏布局 */}
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/3">
                  {/* 个人简介卡片 */}
                  <article className="mb-8 rounded-lg border border-border/70 bg-card/85 p-6 shadow-sm">
                    <header className="flex items-center gap-3 mb-5">
                      <h2 className="text-xl font-bold text-foreground">{t('about.personalIntro')}</h2>
                    </header>

                    <div className="space-y-4">
                      <p
                        className="text-foreground/80 leading-relaxed"
                      >
                        {personalInfo.description}
                      </p>
                      
                      {/* 详细信息列表 */}
                      <div className="grid grid-cols-1 gap-5 mt-2 pb-10">
                        {personalInfo.details.map((info) => (
                          <div 
                            key={info.label}
                            className="rounded-md border border-border/60 bg-brand-blue-soft/55 p-3 dark:bg-brand-blue-soft"
                          >
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{info.label}</span>
                              <span className="font-medium text-foreground">{info.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>

          
                </div>

                <NotesSideber />
              </div>
            </div>
          </div>
        </div>
      </NextRouter>
    </TechBackgroundNoGrid>
  );
};

export default AboutPage;
