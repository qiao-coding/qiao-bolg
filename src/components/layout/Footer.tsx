'use client'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion';
import { BlogData } from '@/types/blog/type';
import { useSession } from 'next-auth/react';

const Footer = () => {
  const year = new Date().getFullYear();

  const [blog, setBlog] = React.useState<BlogData | null>(null);

  const { data: session } = useSession();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/blog');
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error('Failed to fetch blog data:', error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <footer className="relative
     bg-gradient-to-br from-sky-400/40 via-white/20 to-blue-200/50 
     dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 
     backdrop-blur-sm border-t border-sky-200/30 dark:border-gray-700/30
     transition-colors duration-300 ease-in-out">

      <div className="relative container mx-auto px-4 py-12">

        {/* 底部版权信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <span>© 2025 - {year} • {blog?.blogName || 'HanWhite'}</span>
              {session?.user?.name && <span className="text-gray-400">|</span>}
              {session?.user?.name && <span>{session.user.name}</span>}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;