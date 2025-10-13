
import React from 'react'
import Link from 'next/link';
import { Github, Twitter, Mail, ExternalLink, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const Footer = () => {
  const { theme, setTheme } = useTheme();
  const year = new Date().getFullYear();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <footer className="bg-secondary py-12 border-t border-border">
      <div className="container mx-auto px-4">
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8 grid-col">
          <div className="md:col-span-1">
            <div className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
              <span>Hao</span>White
            </div>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                 className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="mailto:example@email.com" 
                 className="text-muted-foreground hover:text-primary transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">导航</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">首页</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">关于我</Link></li>
                <li><Link href="/article" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">笔记</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">内容</h3>
              <ul className="space-y-2">
                <li><Link href="/friend" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">好友</Link></li>
                <li><Link href="/miscellaneous" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">说说</Link></li>
                <li><Link href="/technology" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">发展图</Link></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h3 className="font-semibold text-lg mb-3 text-primary">主题切换</h3>
              <button 
                onClick={toggleTheme} 
                className="bg-background hover:bg-muted p-2 rounded-full border border-border transition-colors"
                aria-label={theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border my-8"></div> */}

        <div className="flex flex-col md:flex-row justify-center items-center">
          <p className="text-muted-foreground text-sm mb-4 ">
            © {year} HaoWhite的个人博客.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;