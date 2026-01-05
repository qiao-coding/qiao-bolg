"use client";
import Link from "next/link";
import React, {  useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ThemeSwitcher } from "../features/theme/ThemeSwitcher";
import { SearchBox } from "../features/search/SearchBox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/shadcnComponents/overlay/dropdown-menu";
import { debounce } from "../logic/public/debounce";
import { useBlogDataContext } from "./BlogDataProvider";

const Header = () => {
  const { blogData } = useBlogDataContext();
  const { resolvedTheme } = useTheme();
  const { data: session } = useSession()
  const [HeaderStyle, setHeaderStyle] = useState(false);
  const scrollRef = useRef(null);

  const HbtnStyle = [
    { id: 1, title: '主页', href: "/", icons: '/header_img/zhuye.svg' },
    { id: 2, title: '笔记', href: "/notes", icons: '/header_img/bijiben.svg' },
    { id: 3, title: '友链', href: "/friend", icons: '/header_img/youlian.svg' },
    { id: 4, title: '说说', href: "/miscellaneous", icons: '/header_img/shuoshuo.svg' },
    { id: 5, title: '关于', href: "/about", icons: '/header_img/leaf.svg' },
  ]


  const handleScroll =
    debounce(() => {
      const scrollY = window.scrollY;
      if (scrollY > 100 && scrollRef.current && scrollY > 0) {
        setHeaderStyle(true);
      } else {
        setHeaderStyle(false);
      }
    }, 100)

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const headerStyleClass = HeaderStyle
    ? "h-18 top-2 header-scrolled bg-sky-300/80 dark:bg-gray-700/80 w-[98vw]"
    : "h-18  top-0 header-normal w-full";

  const menuItemStyleClass = !HeaderStyle ? "text-[14px] md:text-[16px]" : "text-[13px] md:text-[15px]";

  const menuItemHoverStyleClass = resolvedTheme ? "text-sky-600 dark:text-sky-400" : "text-black dark:text-white";

  const menuItemIconClass = ` rounded-full opacity-80`;

  return (
    <div
      className={`fixed z-50 mr-5 duration-800 mx-auto
           rounded-full left-1/2 -translate-x-1/2
          ${headerStyleClass}`}
    >
      <div
        ref={scrollRef}
        className={`navbar z-50 m-auto  duration-0 pr-0`}
      >
        <div className={`navbar-start  mx-auto duration-700 ${!HeaderStyle ? "ml-0" : "ml-5"}`}>
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="cursor-target btn btn-ghost 
                text-black dark:text-sky-300
                hover:bg-sky-300/80 hover:dark:bg-gray-700/80 lg:hidden "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className={`bg-white z-30 
                   dark:bg-gray-700/80 
                   menu menu-sm dropdown-content 
                    rounded-box z-1 mt-3 w-52 
                     shadow bg-base-100 mt-4`}
            >
              {HbtnStyle.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="
                  cursor-target text-black dark:text-white
                  ">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={`p-2 text-sm lg:text-base
            text-black dark:text-white
              font-bold cursor-target 
              ${!HeaderStyle ? "text-[14px] md:text-[16px]" : "text-[15px] md:text-[18px]"} 
              transition-all duration-300`}>
            {blogData?.blogName || 'HaoWhite'}
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1  ">
            {HbtnStyle.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`z-50 p-2 bg-transparent mr-4  bg-transparent cursor-target no-border font-extrabold  
                      ${menuItemStyleClass}
                      ${menuItemHoverStyleClass}
                    `}
                >
                  <motion.div
                    whileHover={{ scale: 1.04, rotate: -3, transition: { duration: 0.3 }, translateY: -10 }}
                    className="flex items-center gap-2 cursor-target "
                  >
                    {item.icons && (
                      <Image
                        src={item.icons}
                        alt=""
                        className={menuItemIconClass}
                        width={20}
                        height={20}
                      />
                    )}

                    <span className="text-black dark:text-white">{item.title}</span>
                  </motion.div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={`navbar-end pr-4 flex items-center gap-4 duration-700 
            ${!HeaderStyle ? "mr-0" : "mr-5"}`}>
          <div className="hidden md:block">
            <SearchBox />
          </div>
          <ThemeSwitcher />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                {session && (
                  <div className="btn btn-circle cursor-target 
                     border-2
                     border-sky-400 
                     dark:border-sky-600
                     hover:dark:border-sky-400 
                     hover:border-yellow-400/80
                     dark:hover:border-sky-400 transition-all duration-300
                      ">
                    <Image
                      src={session.user?.image || '/user_img/up.jpg'}
                      alt={session.user?.name || 'User Avatar'}
                      className={menuItemIconClass}
                      width={40}
                      height={40}
                      loading="lazy"
                    />
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-2 rounded-lg bg-white shadow-lg p-2 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <ul className="space-y-1">
                  {session && (
                    <li>
                      <Link href="/adminLogin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200">
                        后台管理
                      </Link>
                    </li>
                  )}
                  {session && (
                    <li>
                      <button
                        onClick={() => signOut()}
                        type="submit"
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        退出登录？
                      </button>
                    </li>
                  )}
                </ul>
              </DropdownMenuContent>
            </DropdownMenu>

          ) : (

            <Link
              href="/Login"
              className="btn cursor-target btn-dash btn-error hover:text-white transition-all duration-700 ease-in-out"
            >
              登录
            </Link>
          )}

        </div>
      </div>
    </div >
  );
};

export default Header;
