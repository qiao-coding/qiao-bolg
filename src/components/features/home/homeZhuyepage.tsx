'use client'
import Image from "next/image";
import { useSession } from "next-auth/react";
import { SiBilibili, SiGitee, SiGithub, SiTiktok } from "react-icons/si";
import { BookOpen, ChevronDown, Heart, PenLine, Sparkles, Star } from "lucide-react";
import { useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { useBlogDataContext } from "@/components/layout/BlogDataProvider";
import { useT } from "@/i18n/LocaleContext";

export function HomeZhuyepage() {
    const t = useT();
    const { data: session } = useSession()
    const { blogData } = useBlogDataContext();

    const heroImage = useMemo(() => {
        if (session?.user?.image && blogData?.homePage?.isDynamicTiltCard) {
            return session.user.image;
        }
        return '/user_img/up.jpg';
    }, [blogData?.homePage?.isDynamicTiltCard, session?.user?.image]);

    const title = useMemo(() => {
        if (blogData?.homePage?.isDynamicTitle) {
            return session?.user?.name ? `Hi, ${session.user.name}` : 'xiaoxiaoqiao Blog';
        }
        return blogData?.homePage?.mainTitle || 'xiaoxiaoqiao Blog';
    }, [blogData?.homePage?.isDynamicTitle, blogData?.homePage?.mainTitle, session?.user?.name]);

    const getIconComponent = (name: string) => {
        const iconClass = "size-4";
        switch (name.toLowerCase()) {
            case 'github':
                return <SiGithub className={iconClass} />;
            case 'gitee':
                return <SiGitee className={iconClass} />;
            case '抖音':
            case 'tiktok':
                return <SiTiktok className={iconClass} />;
            case '哔哩哔哩':
            case 'bilibili':
                return <SiBilibili className={iconClass} />;
            default:
                return <span className="text-xs font-medium">{name.charAt(0)}</span>;
        }
    }

    return (
        <article className="min-h-[88vh]">
            <section className="mx-auto flex min-h-[88vh] max-w-6xl items-center px-4 pb-12 pt-24 sm:px-6 lg:px-8">
                <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-card/72 p-6 shadow-[0_24px_70px_rgba(255,132,189,0.14)] backdrop-blur-md dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/74 dark:shadow-[0_24px_70px_rgba(10,18,34,0.28)] sm:p-8 lg:p-10">
                        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-brand-pink-soft/80 blur-2xl" />
                        <div className="pointer-events-none absolute -bottom-16 left-20 h-44 w-44 rounded-full bg-brand-blue-soft/80 blur-2xl" />
                        <div className="relative space-y-8">
                            <p className="inline-flex items-center gap-2 rounded-full border border-brand-pink-border bg-white/78 px-3 py-1.5 text-xs font-medium text-brand-pink-deep shadow-sm dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]">
                                <Sparkles className="size-3.5" />
                                Kawaii notes & little findings
                            </p>
                            <div className="space-y-4">
                                <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
                                    {title}
                                </h1>
                                <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                                    {blogData?.homePage?.subTitle || "把日常学习、代码记录和一点点生活感，安静地收在这里。"}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/notes"
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-grad px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,143,199,0.28)] transition-transform hover:-translate-y-0.5"
                                >
                                    <BookOpen className="size-4" />
                                    {t('common.nav.notes')}
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-brand-blue/25 bg-white/78 px-5 text-sm font-semibold text-brand-blue-deep shadow-sm transition-colors hover:bg-brand-blue-soft dark:border-[#8fb7df]/24 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8] dark:hover:bg-[#30405d]"
                                >
                                    <ChevronDown className="size-4" />
                                    {t('home.viewArticles')}
                                </button>
                            </div>

                            {blogData?.homeIcons && blogData.homeIcons.length > 0 && (
                                <nav className="flex flex-wrap gap-2" aria-label="社交链接">
                                    {blogData.homeIcons.map((icon, index) => (
                                        <a
                                            key={index}
                                            href={icon.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`跳转到 ${icon.name}`}
                                            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/80 bg-white/76 px-3.5 text-sm font-medium text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-pink/45 hover:text-brand-pink-deep dark:border-[#8fb7df]/20 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]"
                                        >
                                            {getIconComponent(icon.name)}
                                            <span>{icon.name}</span>
                                        </a>
                                    ))}
                                </nav>
                            )}
                        </div>
                    </div>

                    <aside className="relative rounded-[30px] border border-white/80 bg-white/74 p-5 shadow-[0_24px_60px_rgba(255,143,199,0.22)] backdrop-blur-md dark:border-[#8fb7df]/20 dark:bg-[#202a3f]/76 dark:shadow-[0_24px_60px_rgba(10,18,34,0.28)]">
                        <div className="pointer-events-none absolute -right-4 -top-4 flex size-12 rotate-12 items-center justify-center rounded-2xl bg-brand-pink text-white shadow-lg">
                            <Star className="size-5 fill-current" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative size-24 overflow-hidden rounded-3xl border-4 border-white bg-muted shadow-[0_12px_28px_rgba(103,183,255,0.22)]">
                                <Image
                                    src={heroImage}
                                    alt={session?.user?.name || 'xiaoxiaoqiao avatar'}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <div className="min-w-0">
                                <p className="text-lg font-black text-foreground">xiaoxiaoqiao</p>
                                <p className="mt-1 text-sm leading-6 text-muted-foreground">前端、笔记、折腾记录</p>
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-brand-pink-border/60 pt-5 text-sm">
                            <div className="rounded-2xl border border-brand-blue/20 bg-brand-blue-soft/85 p-4 text-brand-blue-deep shadow-sm dark:border-[#8fb7df]/22 dark:bg-[#b9d7f2]/10 dark:text-[#dbe9f8]">
                                <PenLine className="mb-2 size-4" />
                                <p className="font-bold">Notes</p>
                            </div>
                            <div className="rounded-2xl border border-brand-pink/25 bg-brand-pink-soft/90 p-4 text-brand-pink-deep shadow-sm dark:border-[#f0b8d4]/22 dark:bg-[#f0b8d4]/10 dark:text-[#ffddec]">
                                <Heart className="mb-2 size-4 fill-current" />
                                <p className="font-bold">Life</p>
                            </div>
                        </div>
                        <div className="mt-4 rounded-2xl border border-white/70 bg-brand-grad-soft p-4 text-sm leading-6 text-muted-foreground dark:border-[#8fb7df]/18 dark:bg-[#26334d]/72 dark:text-[#b9c8d8]">
                            愿生活的每一天，都有惊喜!
                        </div>
                    </aside>
                </div>
            </section>
        </article>
    )
}
