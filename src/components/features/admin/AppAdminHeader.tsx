"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useT } from "@/i18n/LocaleContext";
import ThemePage from "@/components/ui/public/themePage";
import {
  Bot,
  GalleryVerticalEnd,
  KeyRound,
  Leaf,
  LinkIcon,
  LogOut,
  Menu,
  MessageCircle,
  NotebookTabs,
  PieChart,
  SettingsIcon,
  UserCog2,
  X,
} from "lucide-react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcnComponents/overlay/dropdown-menu";
import { ApiKeyDialog } from "./ApiKeyDialog";
import { useState } from "react";

// 后台导航项（与公共 Header 同款写法，8 个后台路由）
const adminNav = [
  { nameKey: "dashboard", url: "/admin", icon: PieChart },
  { nameKey: "notesManagement", url: "/admin/notes", icon: NotebookTabs },
  { nameKey: "miscellaneousManagement", url: "/admin/miscellaneous", icon: MessageCircle },
  { nameKey: "friendLinksManagement", url: "/admin/friend-links", icon: LinkIcon },
  { nameKey: "aboutSettings", url: "/admin/about", icon: Leaf },
  { nameKey: "blogSettings", url: "/admin/blog", icon: SettingsIcon },
  { nameKey: "agent", url: "/admin/agent", icon: Bot },
  { nameKey: "adminSettings", url: "/admin/admin-settings", icon: UserCog2 },
];

export function AppAdminHeader() {
  const t = useT();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const { data: session } = useSession();

  // 判断当前激活项（去掉 locale 前缀后比较路径）
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:px-5">
        {/* 左：后台 logo */}
        <div className="flex items-center gap-2">
          <GalleryVerticalEnd className="h-6 w-6 text-brand-blue" />
          <Link
            href="/admin"
            className="text-sm lg:text-base font-semibold tracking-wide text-foreground transition-colors hover:text-brand-blue-deep"
          >
            {t('admin.panelTitle')}
          </Link>
        </div>

        {/* 中：桌面导航 */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="admin-nav">
          {adminNav.map((item) => {
            const active = isActive(item.url);
            const Icon = item.icon;
            return (
              <Link
                key={item.url}
                href={item.url}
                className={`relative flex items-center gap-2 p-2 font-extrabold transition-colors duration-300 ${
                  active
                    ? "text-brand-blue-deep dark:text-brand-blue"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-4" />
                <span>{t(`admin.${item.nameKey}`)}</span>
                <span
                  className={`absolute -bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-brand-blue transition-opacity duration-300 ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* 右：返回主页 + 主题 + 移动端菜单 */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-brand-blue/25 bg-white/78 px-3 py-1.5 text-xs font-medium text-brand-blue-deep shadow-sm dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]"
          >
            {t('common.backToHome')}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="用户菜单"
                className="cursor-pointer rounded-full border border-border bg-card p-0.5 transition-colors duration-300 hover:border-brand-blue"
              >
                <Image
                  src={session?.user?.image || "/user_img/up.jpg"}
                  alt={session?.user?.name || "Admin Avatar"}
                  className="rounded-full opacity-80"
                  width={36}
                  height={36}
                  loading="lazy"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="mr-2 min-w-40 rounded-lg border-border bg-card/95"
            >
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setApiKeyOpen(true)}
              >
                <span className="flex w-full items-center gap-2">
                  <KeyRound className="size-4" />
                  {t("admin.menu.apiKey")}
                </span>
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
                  {t("common.logout")}
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemePage />
          <button
            className="lg:hidden inline-flex items-center justify-center rounded-full p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-md">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {adminNav.map((item) => {
              const active = isActive(item.url);
              const Icon = item.icon;
              return (
                <Link
                  key={item.url}
                  href={item.url}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${
                    active
                      ? "bg-brand-blue-soft/60 text-brand-blue-deep dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]"
                      : "text-muted-foreground hover:bg-brand-pink-soft/40"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{t(`admin.${item.nameKey}`)}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      <ApiKeyDialog open={apiKeyOpen} onOpenChange={setApiKeyOpen} />
    </header>
  );
}
