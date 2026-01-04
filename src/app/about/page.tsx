'use client';
import React, { useState, useEffect } from 'react';
import NextRouter from '@/components/layout/NextRouter';
import TechBackgroundNoGrid from '@/components/ui/public/background_img';
import NotesSideber from '@/components/ui/notes/noteSideber';
import Title from '@/components/ui/public/title';
import { motion } from 'framer-motion'
import { api_about } from '@/hooks/about/api_about';

// 关于页面组件 - 展示个人信息和简介
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
          <motion.div
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 , ease: "easeOut" }}
          >
            <div className="max-w-6xl w-full mx-auto mb-16">
              <Title>关于我</Title>
            </div>
          </motion.div>

          {/* 个人信息和侧边栏内容区域 */}
          <motion.div
            initial={{ opacity: 0, y: 150, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="max-w-6xl w-full mx-auto">
              {/* 主内容和侧边栏布局 */}
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/3">
                  {/* 个人简介卡片 */}
                  <article className="mb-8 bg-white dark:bg-gray-800/90 rounded-2xl shadow-sm dark:shadow-lg dark:shadow-gray-900/20 p-6 dark:border dark:border-gray-700">
                    <header className="flex items-center gap-3 mb-5">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white">个人简介</h2>
                    </header>

                    <div className="space-y-4">
                      <motion.p 
                        className="text-gray-700 dark:text-gray-300 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {personalInfo.description}
                      </motion.p>
                      
                      {/* 详细信息列表 */}
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
                  </article>

          
                </div>

                <NotesSideber />
              </div>
            </div>
          </motion.div>
        </div>
      </NextRouter>
    </TechBackgroundNoGrid>
  );
};

export default AboutPage;