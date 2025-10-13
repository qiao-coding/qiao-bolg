import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import TechBackgroundNoGrid from '../public/background_img';
// 加载动画组件 - 博客风格设计
const LoadingPage: React.FC = () => {
  const { theme } = useTheme();
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const totalPages = 5;

  // 模拟加载进度
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prevProgress) => {
        const newProgress = prevProgress + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    // 模拟翻页效果
    const pageInterval = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    }, 800);

    // 清理函数
    return () => {
      clearInterval(interval);
      clearInterval(pageInterval);
    };
  }, []);

  const paragraphs: string[] = [
    '欢迎阅读我的个人博客...',
    '记录学习笔记...',
    '一切的开头源于一场热爱...',
    '记录学习与成长的点滴...',
    '可不要放弃啊...'
  ];

  return (
    <section className='h-screen'>
    <TechBackgroundNoGrid>
    <div className="flex flex-col items-center pt-80 justify-center min-h-[50vh] w-full py-10 px-4">
      <div className={`
        w-full max-w-md p-6 rounded-xl shadow-lg
        ${theme === 'light' ? 'bg-white/90' : 'bg-gray-800/90'}
        backdrop-blur-sm border border-border/20
        transition-all duration-500
      `}>
        {/* 笔记本图标动画 */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-full h-full rounded-lg border-2
                  ${theme === 'light' ? 'border-primary' : 'border-primary/80'}
                  opacity-${70 - i * 15} animate-fade-in-down
                `}
                style={{
                  transform: `translate(${i * 3}px, ${i * 3}px)`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s',
                  animationIterationCount: 'infinite',
                  animationDirection: 'alternate'
                }}
              />
            ))}
            <div 
              className={`absolute inset-0 flex items-center justify-center
                ${theme === 'light' ? 'text-primary' : 'text-primary'}
              `}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 动态加载文本 */}
        <div className="mb-6 text-center">
          <p 
            className={`
              text-lg font-medium transition-opacity duration-300
              ${theme === 'light' ? 'text-primary' : 'text-primary'}
            `}
            key={currentPage}
          >
            {paragraphs[currentPage]}
          </p>
          <div className="flex justify-center mt-2 space-x-1">
            {[...Array(totalPages)].map((_, i) => (
              <div
                key={i}
                className={`
                  h-1.5 rounded-full transition-all duration-300
                  ${i === currentPage 
                    ? (theme === 'light' ? 'bg-primary w-8' : 'bg-primary/80 w-8') 
                    : (theme === 'light' ? 'bg-border/50 w-3' : 'bg-border/30 w-3')
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* 进度条 */}
        <div className="w-full h-2 rounded-full bg-border/30 overflow-hidden">
          <div
            className={`
              h-full rounded-full transition-all duration-700 ease-out
              ${theme === 'light' ? 'bg-primary' : 'bg-primary/80'}
            `}
            style={{ width: `${loadingProgress}%` }}
          />
        </div>

        {/* 加载状态文本 */}
        <p 
          className={`
            mt-4 text-sm text-center transition-colors
            ${theme === 'light' ? 'text-muted-foreground' : 'text-muted-foreground'}
          `}
        >
          正在准备您的阅读体验...
        </p>
      </div>
    </div>
    </TechBackgroundNoGrid>
    </section>
  );
};

export default LoadingPage;