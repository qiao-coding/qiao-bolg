'use client';
import React from 'react';
import { useTheme } from 'next-themes';
import NextRouter from '@/components/layout/NextRouter';
import AnimatedContent from '@/components/ui/shadcnComponents/AnimatedContent';
import {Book, BookOpen,  }
  from 'lucide-react';
import TechBackgroundNoGrid from '@/components/ui/public/background_img';
import NotesSideber from '@/components/ui/notes/NotesSideber';
import Title from '@/components/ui/public/title';
import Image from 'next/image';

const AboutPage = () => {
  const { theme } = useTheme();

  return (
    <TechBackgroundNoGrid>
      <NextRouter>
        <div className="pt-20 pb-16 px-4">
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
                <div className="w-full">
                  <div className={`mb-8 ${theme === 'light' ? 'bg-white rounded-2xl shadow-sm p-6' : 'bg-gray-800/90 rounded-2xl shadow-lg shadow-gray-900/20 p-6 border border-gray-700'}`}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-primary/10 text-primary' : 'bg-primary/20 text-primary/90'}`}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>个人简介</h2>
                    </div>
                    
                    <div className={`space-y-3 leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      <p className="text-sm">
                        你好！我是昊小白，一名热爱前端开发的前端小白
                        </p>
                    </div>
                  </div>

                   {/* <div className={`mb-8 ${theme === 'light' ? 'bg-white rounded-2xl shadow-sm p-6' : 'bg-gray-800/90 rounded-2xl shadow-lg shadow-gray-900/20 p-6 border border-gray-700'}`}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-primary/10 text-primary' : 'bg-primary/20 text-primary/90'}`}>
                        <Book className="w-5 h-5" />
                      </div>
                      <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}></h2>
                    </div>
                  </div> */}


                </div>

                <NotesSideber/>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </NextRouter>
    </TechBackgroundNoGrid>
  );
};

export default AboutPage;