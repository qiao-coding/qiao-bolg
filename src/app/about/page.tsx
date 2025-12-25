'use client';
import React, { useState, useEffect } from 'react';
import NextRouter from '@/components/layout/NextRouter';
import AnimatedContent from '@/components/ui/shadcnComponents/AnimatedContent';

import TechBackgroundNoGrid from '@/components/ui/public/background_img';
import NotesSideber from '@/components/ui/notes/noteSideber';
import Title from '@/components/ui/public/title';
import { motion } from 'framer-motion'

const AboutPage = () => {
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
        const response = await fetch('/api/about');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || '获取数据失败');
        }
        
        setPersonalInfo(data);
      } catch (error) {
        console.error('获取关于页面数据失败:', error);
      }
    };
    
    fetchAboutData();
  }, []);


  return (
    <TechBackgroundNoGrid>
      <NextRouter>
        <div className="pt-20 pb-16 px-4 min-h-screen">
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
            <div className="max-w-6xl w-full mx-auto mb-16">
              <Title>关于我</Title>
            </div>
          </AnimatedContent>

          <AnimatedContent
            distance={100}
            direction="vertical"
            duration={0.8}
            delay={0.2}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={1}
            threshold={0.1}
          >
            <div className="max-w-6xl w-full mx-auto">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/3">
                  {/* 个人信息卡片 */}
                  <div className="mb-8 bg-white dark:bg-gray-800/90 rounded-2xl shadow-sm dark:shadow-lg dark:shadow-gray-900/20 p-6 dark:border dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-5">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white">个人简介</h2>
                    </div>

                    <div className="space-y-4">
                      <motion.p 
                        className="text-gray-700 dark:text-gray-300 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {personalInfo.description}
                      </motion.p>
                      
                      <div className="grid grid-cols-1 gap-5 mt-2 pb-10">
                        {personalInfo.details.map((info, index) => (
                          <motion.div 
                            key={info.label}
                            className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                          >
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">{info.label}</span>
                              <span className="font-medium text-gray-800 dark:text-white">{info.value}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

          
                </div>

                <NotesSideber />
              </div>
            </div>
          </AnimatedContent>
        </div>
      </NextRouter>
    </TechBackgroundNoGrid>
  );
};

export default AboutPage;