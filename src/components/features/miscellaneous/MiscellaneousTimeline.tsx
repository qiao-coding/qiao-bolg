'use client'
import { miscellaneousType } from '@/types/miscellaneous/type';
import Image from 'next/image';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/shadcnComponents/data-display/card";
import { useEffect, useState } from "react";
import NotesSideber from '@/components/ui/notes/noteSideber';
import PageNavigation from '../notes/PageNavigation';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github.css';
import { ArrowUpIcon } from 'lucide-react';

// 创建单独的TimelineItem组件以支持独立的动画延迟
function TimelineItem({ item }: { item: miscellaneousType }) {
  // 为每个卡片生成随机的延迟时间，实现错位动画效果
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    setDelay(Math.random() * 0.5);
  }, []);

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
        scale: { duration: 0.4, ease: "easeOut" }
      }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
    >
      <Card className="overflow-hidden h-full border
       border-gray-200 dark:border-gray-700 shadow-sm  
       hover:shadow-md
       bg-card/70
        dark:bg-gray-800 rounded-xl"
      >
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-500/30  group-hover:ring-blue-500/50">
                <Image
                  src="/UserImage/up.jpg"
                  alt="User Image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg mb-3">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    p: ({ className, ...props }) => <p className={`my-4 leading-relaxed ${className || ''}`} {...props} />,
                    h1: ({ className, ...props }) => <h1 className={`text-3xl font-bold mt-8 mb-4 ${className || ''}`} {...props} />,
                    h2: ({ className, ...props }) => <h2 className={`text-2xl font-bold mt-8 mb-3 ${className || ''}`} {...props} />,
                    h3: ({ className, ...props }) => <h3 className={`text-xl font-bold mt-6 mb-2 ${className || ''}`} {...props} />,
                    code: ({ className, ...props }) => {
                      return <code className={className} {...props} />;
                    },
                    pre: ({ className, ...props }) => {
                      return (
                        <pre className={`${className} overflow-x-auto p-4 rounded-lg mb-4`} {...props} />
                      );
                    },
                    a: ({ ...props }) => <a
                      className="text-[#4A6FA5] hover:text-[#3A5F95] underline dark:text-blue-400 dark:hover:text-blue-300"
                      {...props} />
                  }}
                >
                  {item.content}
                </ReactMarkdown>
              </div>
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  记录于 {item.date}
                </p>
                <div className="flex items-center">
                  <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full transition-colors duration-300">#{item.id}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function MiscellaneousTimeline({
  items,
}: {
  items: miscellaneousType[];
}) {
  return (
    <section >
      <div className="max-w-4xl mx-4   lg:mx-0 lg:mx-[calc(50%-18rem)] lg:max-w-3xl">
        {items.map((item) => (
          <TimelineItem key={item.id} item={item} />
        ))}
      </div>


    </section>
  );
}