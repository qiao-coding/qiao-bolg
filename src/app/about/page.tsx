'use client';
import React from 'react';
import { useTheme } from 'next-themes';
import NextRouter from '@/components/layout/NextRouter';
import AnimatedContent from '@/components/ui/shadcnComponents/AnimatedContent';
import { Book, BookOpen, TreeDeciduousIcon, }
  from 'lucide-react';
import TechBackgroundNoGrid from '@/components/ui/public/background_img';
import NotesSideber from '@/components/ui/notes/NotesSideber';
import Title from '@/components/ui/public/title';
import Image from 'next/image';
import InfiniteScroll from '@/components/ui/about/InfiniteScroll';
import { TreeScroll } from '@/components/ui/about/TreeScroll';
import { motion } from 'framer-motion'

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
                <div className="w-full lg:w-230">
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

                  <div className={`mb-8  ${theme === 'light' ? 'bg-white rounded-2xl shadow-sm p-6' : 'bg-gray-800/90 rounded-2xl shadow-lg shadow-gray-900/20 p-6 border border-gray-700'}`}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-primary/10 text-primary' : 'bg-primary/20 text-primary/90'}`}>
                        <TreeDeciduousIcon className="w-6 h-6" />
                      </div>
                      <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>技能树</h2>
                      <div>

                      </div>

                    </div>
                    <div className='w-full h-[400px] mr-0 overflow-hidden pl-5 flex justify-between '>

                      <div className='w-full flex'>
                        <div className="flex items-center gap-8 mb-5 w-130 flex-col">

                          <div>
                            <span className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'} p-0 w-full flex justify-center`}>基础知识</span>
                            <span className='pt-5 flex items-center w-full gap-12'>
                              <motion.div
                                whileInView={{ opacity: 1, x: 0 }}
                                whileHover={{ y: -5 }}
                                className='hover:text-orange-500'

                              >
                                <Image src="/about/html_img.png" alt="html" width={100} height={100} className='rounded-lg cursor-pointer hover:shadow-lg hover:shadow-orange-500/40 p-2' />
                                <span className='text-sm text-center block pt-2 '>HTML</span>
                              </motion.div>
                              <motion.div
                                whileInView={{ opacity: 1, x: 0 }}
                                whileHover={{ y: -5 }}
                                className='hover:text-blue-500'

                              >
                                <Image src="/about/css_img.png" alt="css" width={100} height={100} className='rounded-lg cursor-pointer hover:shadow-lg hover:shadow-blue-500/40 ' />
                                <span className='text-sm text-center block pt-2 '>CSS</span>
                              </motion.div>
                              <motion.div
                                whileInView={{ opacity: 1, x: 0 }}
                                whileHover={{ y: -5 }}
                                className='hover:text-yellow-500'

                              >
                                <Image src="/about/js_img.png" alt="js" width={100} height={100} className='rounded-lg cursor-pointer hover:shadow-lg hover:shadow-yellow-500  w-20 h-20' />
                                <span className='text-sm text-center block pt-2 '>JavaScript</span>

                              </motion.div>




                            </span>

                          </div>

                          <div>
                            <span className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'} p-0 w-full flex justify-center`}>前端框架</span>
                            <span className='pt-5 flex items-center w-full gap-12'>
                              <motion.div
                                whileInView={{ opacity: 1, x: 0 }}
                                whileHover={{ y: -5 }}
                                className='hover:text-sky-400'

                              >
                                <Image src="/about/react_img.svg" alt="html" width={100} height={100} className='rounded-lg cursor-pointer hover:shadow-lg hover:shadow-sky-400/40 p-2' />
                                <span className='text-sm text-center block pt-2 '>React</span>
                              </motion.div>
                              <motion.div
                                whileInView={{ opacity: 1, x: 0 }}
                                whileHover={{ y: -5 }}
                                className='hover:text-black/70'

                              >
                                <div className='rounded-lg cursor-pointer hover:shadow-lg hover:shadow-black/70 p-4 w-23 h-23 flex items-center justify-center'>
                                  <Image src="/about/next_img.svg" alt="next" width={150} height={100} />
                                </div>
                                <span className='text-sm text-center block pt-2 '>Next.js</span>
                              </motion.div>
                            </span>

                          </div>

                        </div>
                      </div>
                      <div className=' relative lg:left-40'>
                        <TreeScroll />
                      </div>
                    </div>
                    <div>
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