
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
    <footer className="bg-sky-300/90 dark:bg-gray-700 py-12 border-t border-border">
      <div className="container mx-auto px-4">

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