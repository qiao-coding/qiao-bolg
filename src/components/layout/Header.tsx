"use client";
import { Link, usePathname } from "@/i18n/navigation";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Menu, LogOut, LayoutDashboard } from "lucide-react";
import { ThemeSwitcher } from "../features/theme/ThemeSwitcher";
import { SearchBox } from "../features/search/SearchBox";
import { LanguageSwitcher } from "../features/i18n/LanguageSwitcher";
import { Button } from "../ui/shadcnComponents/forms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/shadcnComponents/overlay/dropdown-menu";
import { debounce } from "../logic/public/debounce";
import { useBlogDataContext } from "./BlogDataProvider";
import { useT } from '@/i18n/LocaleContext';

const Header = () => {
  const { blogData } = useBlogDataContext();
  const { data: session } = useSession();
  const [HeaderStyle, setHeaderStyle] = useState(false);
  const scrollRef = useRef(null);
  const t = useT();
  const pathname = usePathname();

  const HbtnStyle = [
    { id: 1, title: t('common.nav.home'), href: "/", icons: '/header_img/zhuye.svg' },
    { id: 2, title: t('common.nav.notes'), href: "/notes", icons: '/header_img/bijiben.svg' },
    { id: 3, title: t('common.nav.friend'), href: "/friend", icons: '/header_img/youlian.svg' },
    { id: 5, title: t('common.nav.miscellaneous'), href: "/miscellaneous", icons: '/header_img/shuoshuo.svg' },
    { id: 6, title: t('common.nav.about'), href: "/about", icons: '/header_img/leaf.svg' },
  ];

  // 判断当前激活项（去掉 locale 前缀后比较路径）
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const handleScroll =
    debounce(() => {
      const scrollY = window.scrollY;
      if (scrollY > 100 && scrollRef.current && scrollY > 0) {
        setHeaderStyle(true);
      } else {
        setHeaderStyle(false);
      }
    }, 100);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const headerStyleClass = HeaderStyle
    ? "h-16 top-0 w-full bg-background/92 backdrop-blur-md border-b border-border/70 shadow-sm"
    : "h-16 top-0 w-full bg-background/80 backdrop-blur-sm border-b border-border/50";

  // 导航链接（桌面 + 移动共用，hover 微动效一致）
  const renderNavLink = (item: (typeof HbtnStyle)[number]) => {
    const active = isActive(item.href);
    return (
      <Link
        key={item.id}
        href={item.href}
        className={`relative flex items-center gap-2 p-2 font-extrabold transition-colors duration-300
          ${active
            ? "text-brand-blue-deep dark:text-brand-blue"
            : "text-muted-foreground hover:text-foreground"}`}
        aria-current={active ? "page" : undefined}
      >
        <div className="flex items-center gap-2">
          {item.icons && (
            <Image
              src={item.icons}
              alt=""
              className="rounded-full opacity-80"
              width={20}
              height={20}
            />
          )}
          <span>{item.title}</span>
        </div>
        <span
          className={`absolute -bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-brand-blue transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}
        />
      </Link>
    );
  };

  return (
    <div
      className={`fixed z-50 mx-auto left-1/2 -translate-x-1/2 transition-all duration-300 ${headerStyleClass}`}
    >
      <div
        ref={scrollRef}
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:px-5"
      >
        {/* 左：博客名 */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm lg:text-base font-semibold tracking-wide text-foreground transition-colors duration-300 hover:text-brand-blue-deep"
          >
            {blogData?.blogName || 'HaoWhite'}
          </Link>
        </div>

        {/* 中：桌面导航 */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="主导航">
          {HbtnStyle.map((item) => renderNavLink(item))}
        </nav>

        {/* 右：搜索 + 主题 + 语言 + 用户 */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:block">
            <SearchBox />
          </div>
          <ThemeSwitcher />
          <LanguageSwitcher />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="用户菜单"
                  className="cursor-pointer rounded-full border border-border bg-card p-0.5 transition-colors duration-300 hover:border-brand-blue"
                >
                  <Image
                    src={session.user?.image || '/user_img/up.jpg'}
                    alt={session.user?.name || 'User Avatar'}
                    className="rounded-full opacity-80"
                    width={36}
                    height={36}
                    loading="lazy"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mr-2 min-w-40 rounded-lg border-border bg-card/95">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/adminLogin" className="flex items-center gap-2">
                    <LayoutDashboard className="size-4" />
                    {t('common.adminPanel')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
                >
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-2"
                  >
                    <LogOut className="size-4" />
                    {t('common.logout')}
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/Login">
              <Button className="rounded-md bg-foreground text-background hover:bg-foreground/85">
                {t('common.login')}
              </Button>
            </Link>
          )}

          {/* 移动端菜单 */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="打开菜单" className="cursor-pointer">
                  <Menu className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mr-2 min-w-52 rounded-lg border-border bg-card/95">
                {HbtnStyle.map((item) => (
                  <DropdownMenuItem key={item.id} asChild className="cursor-pointer">
                    <Link href={item.href} className="flex items-center gap-2">
                      <Image src={item.icons} alt="" width={18} height={18} />
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
