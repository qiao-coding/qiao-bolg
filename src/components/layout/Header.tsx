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
import UpImg from "../../../public/UserImage/up.jpg";





const Header = () => {
  interface btnInterface {
    id: number;
    tlitle: string;
    hrfe: string;
    icons?: string;
  }

  const [HbtnStyle] = useState<btnInterface[]>([
    { id: 1, tlitle: "首页", hrfe: "/", icons: zhuye },
    { id: 2, tlitle: "笔记", hrfe: "/article", icons: bijiben },
    { id: 3, tlitle: "友链", hrfe: "/friend", icons: youlian },
    { id: 4, tlitle: "说说", hrfe: "/miscellaneous", icons: shuoshuo },
    // { id: 5, tlitle: "技能点", hrfe: "/technology", icons: luxian },
    { id: 6, tlitle: "关于我", hrfe: "/about", icons: leaf },
  ]);

  const { resolvedTheme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(false);






  //主题色切换
  useEffect(() => {
    if (resolvedTheme) {
      setIsDark(resolvedTheme === "dark");
    }
  }, [resolvedTheme]);

  const handleIsDark = () => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setIsDark(newTheme === "dark");
  };

  const [HeaderStyle, setHeaderStyle] = useState(false);

  const scrollRef = useRef(null);




  //滚动监听
  useEffect(() => {
    const handleScroll = throttle(() => {
      {

        if (window.scrollY > 100 && scrollRef.current && window.scrollY > 0) {
          setHeaderStyle(true);
        } else {
          setHeaderStyle(false);
        }
      }
    }, 100)
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  //  ${HeaderStyle?isDark?'bg-gray-500 pt-0':'bg-sky-300 pt-0':''}

  return (
    <div
      className={`w-full  fixed z-50  ${HeaderStyle
          ? isDark
            ? "bg-gray-700/80 pt-0 duration-700 h-15 bottom-[94vh]"
            : "bg-sky-300/70 pt-0 duration-700 h-15 bottom-[94vh]"
          : `${isDark ? "bg-gray-0 pt-0 bottom-[92vh] h-18 duration-700" : " duration-700 bg-sky-0 pt-0 bottom-[92vh] h-18"}`
        } `}
    >
      <div
        ref={scrollRef}
        className={`navbar fixed  z-50 m-auto  duration-0 pr-0
     
    `}
      >
        <div className="navbar-start relative">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="cursor-target btn btn-ghost lg:hidden "
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
              className={`${isDark ? 'bg-gray-700/80' : 'bg-white-700/80'} menu menu-sm dropdown-content  rounded-box z-1 mt-3 w-52  shadow bg-base-100 mt-4`}
            >
              {HbtnStyle.map((item) => (
                <li key={item.id}>
                  <Link href={item.hrfe} className="cursor-target">
                    {item.tlitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <a className={`p-2 font-bold text-xl cursor-target `}>
            HaoWhite
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1  ">
            {HbtnStyle.map((item) => (
              <li key={item.id}>
                {resolvedTheme ? (
                  <Link
                    href={item.hrfe}
                    className={` z-50 p-2 bg-transparent mr-4   cursor-target no-border font-extrabold  
                          ${!HeaderStyle ? "text-[15px]" : "text-[14px]"}
                         ${resolvedTheme === "light"
                        ? "text-black"
                        : "text-white"
                      }`}
                  >
                    {item.icons && (
                      <Image
                        src={item.icons}
                        alt=""
                        className="w-5 h-5 opacity-80"
                      />
                    )}

                    <span>{item.tlitle}</span>
                  </Link>
                ) : (
                  <Link
                    href={item.hrfe}
                    className="text-[17px] z-10  p-2 bg-transparent mr-4   cursor-target no-border font-extrabold text-black"
                  >
                    {item.icons && (
                      <Image
                        src={item.icons}
                        alt=""
                        className="w-5 h-5 opacity-80"
                      />
                    )}

                    <span>{item.tlitle}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end flex items-center gap-4">
          <label className="swap swap-rotate mr-2 cursor-target ">
            <input
              type="checkbox"
              className="theme-controller"
              value="synthwave"
              checked={isDark}
              onChange={handleIsDark}
            />

            <svg
              className="swap-off h-8 w-8 fill-current text-yellow-500 duration-700"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            <svg
              className="swap-on h-8 w-8 fill-current text-primary-500 duration-700"
              xmlns="http://www.w3.org/2000/svg "
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
          <div>
            {user ? (
              <span>
                <div className="dropdown dropdown-start p-2 ">
                  <Image
                    src={UpImg}
                    alt="1"
                    tabIndex={0}
                    role="button"
                    className="btn btn-circle relativep-0 cursor-target"
                  />
                  <div className="relative right-20 ">
                    <ul
                      tabIndex={0}
                      className="dropdown-content  menu bg-base-100 rounded-box z-1 w-28  shadow-sm mt-2"
                    >
                      <li >
                        <Link href="/adminLogin" className="cursor-target">后台管理</Link>
                      </li>
                      <li>
                          <button type="submit"  className="text-red-500 cursor-target">
                            退出登录？
                          </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </span>
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
      </div>
    </div>
  );
};

export default Header;
