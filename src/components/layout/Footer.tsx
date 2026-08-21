'use client'
import { useSession } from 'next-auth/react';
import { useBlogDataContext } from './BlogDataProvider';

const Footer = () => {
  const year = new Date().getFullYear();
  const { data: session } = useSession();
  const { blogData } = useBlogDataContext();

  return (
    <footer className="relative border-t border-border/70 bg-background/85 transition-colors duration-300 ease-in-out">

      <div className="relative container mx-auto px-4 py-12">

        {/* 底部版权信息 */}
        <div>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© 2025 - {year} • {blogData?.blogName || 'xiaoxiaoqiao'}</span>
              {session?.user?.name && <span className="text-muted-foreground/70">|</span>}
              {session?.user?.name && <span>{session.user.name}</span>}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
