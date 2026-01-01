"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import zhuye from "../../../public/titleImage/zhuye.svg";
import bijiben from "../../../public/titleImage/bijiben.svg";
import shuoshuo from "../../../public/titleImage/shuoshuo.svg";
import youlian from "../../../public/titleImage/youlian.svg";
import leaf from "../../../public/titleImage/leaf.svg";
import Image from "next/image";
import { useTheme } from "next-themes";
import { throttle } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ThemeSwitcher } from "../features/theme/ThemeSwitcher";
import { SearchBox } from "../features/search/SearchBox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/shadcnComponents/overlay/dropdown-menu";

const Header = () => {

  const HbtnStyle = [
    { id: 1, title: '主页', href: "/", icons: zhuye },
    { id: 2, title: '笔记', href: "/notes", icons: bijiben },
    { id: 3, title: '友链', href: "/friend", icons: youlian },
    { id: 4, title: '说说', href: "/miscellaneous", icons: shuoshuo },
    { id: 5, title: '关于', href: "/about", icons: leaf },
  ]

  const { resolvedTheme } = useTheme();
  const { data: session } = useSession()
  const [title, setTitle] = useState('HaoWhite');
  const [HeaderStyle, setHeaderStyle] = useState(false);
  const scrollRef = useRef(null);

  const gettitle = async () => {
    const res = await fetch('/api/blog');
    const data = await res.json();
    setTitle(data.blogName);
  }

  useEffect(() => {
    gettitle();

    const handleScroll = throttle(() => {
      if (window.scrollY > 100 && scrollRef.current && window.scrollY > 0) {
        setHeaderStyle(true);
      } else {
        setHeaderStyle(false);
      }
    }, 100)
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);



  return (
    <div
      className={` fixed z-50 mr-5 duration-700 mx-auto rounded-full left-1/2 -translate-x-1/2
        ${HeaderStyle
          ? "h-18 top-2 header-scrolled bg-sky-300/80 dark:bg-gray-700/80 w-[98vw]"
          : "h-18  top-0 header-normal w-full"
        }`}
    >
      <div
        ref={scrollRef}
        className={`navbar fixed  z-50 m-auto  duration-0 pr-0
     
    `}
      >
        <div className={`navbar-start relative mx-auto duration-700 ${!HeaderStyle ? "ml-0" : "ml-5"}`}>
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="cursor-target btn btn-ghost 
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
              className={`bg-white z-30 dark:bg-gray-700/80 menu menu-sm dropdown-content  rounded-box z-1 mt-3 w-52  shadow bg-base-100 mt-4`}
            >
              {HbtnStyle.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="cursor-target">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <a className={`p-2 font-bold text-xl cursor-target ${!HeaderStyle ? "text-[20px]" : "text-[19px]"}`}>
            {title}
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1  ">
            {HbtnStyle.map((item) => (
              <li key={item.id}>
                {resolvedTheme ? (


                  <Link
                    href={item.href}
                    className={` z-50 p-2 bg-transparent mr-4  bg-transparent cursor-target no-border font-extrabold  
                          ${!HeaderStyle ? "text-[15px]" : "text-[14px]"}
                         ${"text-black dark:text-white"}
                      }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.04, rotate: -3, transition: { duration: 0.3 }, translateY: -10 }}
                      className="flex items-center gap-2 cursor-target "
                    >
                      {item.icons && (
                        <Image
                          src={item.icons}
                          alt=""
                          className="w-5 h-5 opacity-80"
                        />
                      )}

                      <span>{item.title}</span>
                    </motion.div>
                  </Link>

                ) : (
                  <Link
                    href={item.href}
                    className="text-[17px] z-10  p-2 bg-transparent mr-4   cursor-target no-border font-extrabold text-black"
                  >
                    {item.icons && (
                      <Image
                        src={item.icons}
                        alt=""
                        className="w-5 h-5 opacity-80"
                      />
                    )}

                    <span>{item.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className={`navbar-end pr-4 flex items-center gap-4 duration-700 ${!HeaderStyle ? "mr-0" : "mr-5"}`}>
          <div className="hidden md:block">
            <SearchBox />
          </div>
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger>
              {session ? (
                <div className="btn btn-circle cursor-target 
                  border-2
                   border-sky-400 
                   dark:border-slate-600
                   hover:dark:border-sky-500 
                   hover:border-slate-600/40 
                   dark:hover:border-sky-500 transition-all duration-300 avatar">
                  <Image
                    src={session.user?.image || '/default-avatar.png'}
                    alt={session.user?.name || 'User Avatar'}
                    className="w-8 h-8 rounded-full"
                    width={40}
                    height={40}
                  />
                </div>
              ) : (
                <Link
                  href="/Login"
                  className="btn cursor-target btn-dash btn-error hover:text-white transition-all duration-700 ease-in-out"
                >
                  登录
                </Link>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-2 rounded-lg bg-white shadow-lg p-2 dark:bg-gray-800">
              <ul className="space-y-1">
                {session && (
                  <li>
                    <Link href="/adminLogin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                      后台管理
                    </Link>
                  </li>
                )}
                {session && (
                  <li>
                    <button
                      onClick={() => signOut()}
                      type="submit"
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-red-400 text-sm"
                    >
                      退出登录？
                    </button>
                  </li>
                )}
              </ul>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
