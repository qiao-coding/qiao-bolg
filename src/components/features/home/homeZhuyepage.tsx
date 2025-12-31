'use client'
import { FaAngleDoubleDown } from "react-icons/fa";
import { motion } from "framer-motion";
import TiltedCard from "@/components/ui/shadcnComponents/TiltedCard";
import { useSession } from "next-auth/react";
import { SiGitee, SiGithub } from "react-icons/si";
import { SiTiktok } from "react-icons/si";
import { FaBilibili } from "react-icons/fa6";
import { useState, useEffect } from "react";




export function HomeZhuyepage() {
    const { data: session } = useSession()
    const [blogData, setBlogData] = useState({
        homePage: {
            mainTitle: "Hi! HaoWhite 🥰",
            subTitle: "愿生活的每一天，都有惊喜!",
            isDynamicTitle: true,
            isDynamicTiltCard: true,

        },
        homeIcons: [
            {
                name: "GitHub",
                link: "https://github.com/xier123456"
            },
            {
                name: "Gitee",
                link: "https://gitee.com/xier123456"
            },
            {
                name: "抖音",
                link: "https://www.douyin.com/user/self?from_tab_name=main&showTab=post"
            },
            {
                name: "哔哩哔哩",
                link: "https://space.bilibili.com/3493288889813717?spm_id_from=333.1007.0.0"
            }
        ]
    });

    // 页面加载时获取博客设置数据
    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const response = await fetch('/api/blog');
                const data = await response.json();


                if (!response.ok) {
                    throw new Error(data.error || '获取数据失败');
                }

                setBlogData(data);
            } catch (error) {
                console.error('获取博客设置数据失败:', error);
                // 使用默认数据
            }
        };

        fetchBlogData();
    }, []);

    
    const handleTiltedCard = () => {
        if (blogData.homePage.isDynamicTiltCard) {
            return (session && session.user?.image) || '/UserImage/up.jpg';
        }
        return  '/UserImage/up.jpg';
    }

    

    
    const handleTitle = () => {
        if (blogData.homePage.isDynamicTitle) {
            return session && `Hi ${session.user?.name} 🥰` || 'Hi HaoWhite 🥰';
        }
        return blogData.homePage.mainTitle || 'HaoWhite';
    }


    const getIconComponent = (name: string) => {
        switch (name.toLowerCase()) {
            case 'github':
                return (
                    <SiGithub
                        className="
                            fill-current rounded
                            text-3xl
                            w-9 h-9 p-2 mt-2
                            bg-white/90 dark:bg-[#24292e]/30
                            hover:bg-[#24292e]/90 hover:dark:bg-white/90
                            text-[#24292e] dark:text-gray-200
                            hover:text-white hover:dark:text-[#24292e]
                            cursor-target transition-colors
                        "
                    />
                );
            case 'gitee':
                return (
                    <SiGitee
                        className="
                            fill-current rounded
                            text-3xl
                            w-9 h-9 p-2 mt-2
                            bg-white/90 dark:bg-[#c71d23]/30
                            hover:bg-[#c71d23]/90 hover:dark:bg-white/90
                            text-[#c71d23] dark:text-gray-200
                            hover:text-white hover:dark:text-[#c71d23]
                            cursor-target transition-colors
                        "
                    />
                );
            case '抖音':
            case 'tiktok':
                return (
                    <SiTiktok
                        className="
                            fill-current rounded
                            text-3xl
                            w-9 h-9 p-2 mt-2
                            bg-white/90 dark:bg-black/30
                            hover:bg-black/90 hover:dark:bg-white/90
                            text-black dark:text-gray-200
                            hover:text-white hover:dark:text-black
                            cursor-target transition-colors
                        "
                    />
                );
            case '哔哩哔哩':
            case 'bilibili':
                return (
                    <FaBilibili
                        className="
                            fill-current rounded
                            text-3xl
                            w-9 h-9 p-2 mt-2
                            bg-white/90 dark:bg-[#00a1d6]/30
                            hover:bg-[#00a1d6]/90 hover:dark:bg-white/90
                            text-[#00a1d6] dark:text-gray-200
                            hover:text-white hover:dark:text-[#00a1d6]
                            cursor-target transition-colors
                        "
                    />
                );
            default:
                return (
                    <div className="
                        rounded
                        text-3xl
                        w-9 h-9 p-2 mt-2
                        bg-white/90 dark:bg-gray-500/30
                        hover:bg-gray-500/90 hover:dark:bg-white/90
                        text-gray-500 dark:text-gray-200
                        hover:text-white hover:dark:text-gray-500
                        cursor-target transition-colors
                        flex items-center justify-center
                    ">
                        {name.charAt(0)}
                    </div>
                );
        }
    };
    return (
        <article className={` min-h-screen bg-cover homebg bg-center bg-no-repeat  to-white   min-h-screen bg-cover `}>

            <section className="hero min-h-screen dark:bg-black/60 p-6" >
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="hero-content flex-col lg:flex-row-reverse gap-22">
                    <figure className="cursor-target">
                        <TiltedCard
                            imageSrc={handleTiltedCard()}
                            captionText=""
                            containerHeight="200px"
                            containerWidth="200px"
                            imageHeight="200px"
                            imageWidth="200px"
                            rotateAmplitude={12}
                            scaleOnHover={1.1}
                            showMobileWarning={false}
                            showTooltip={false}
                            displayOverlayContent={true}
                        />
                    </figure>
                    <header>
                        <h1 className="mt-2 text-5xl font-bold text-center text-slate-700 dark:text-white">
                            {handleTitle()}
                        </h1>

                        <p className="py-6">{blogData.homePage?.subTitle || "愿生活的每一天，都有惊喜!"}</p>
                        <nav className="flex gap-10 justify-center">
                            {blogData.homeIcons?.map((icon, index) => (
                                <a
                                    key={index}
                                    href={icon.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`跳转到 ${icon.name}`}
                                >
                                    <motion.div
                                        className="cursor-target "
                                        whileHover={{ scale: 1.1, rotate: -5, transition: { duration: 0.3 }, translateY: -10 }}
                                    >
                                        {getIconComponent(icon.name)}
                                    </motion.div>
                                </a>
                            ))}
                        </nav>
                    </header>
                </motion.div>
            </section>
            <motion.div
                animate={{
                    y: [0, 10, 0],
                    transition: {
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'easeInOut'
                    }
                }}
                className="flex justify-center -mt-24 relative z-10 relative bottom-15 text-center"

            >
                <button
                    onClick={() => {
                        const articlesSection = document.getElementById('articles-section');
                        if (articlesSection) {
                            articlesSection.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }}
                    className="group cursor-target transform transition-all duration-300 hover:scale-110 cursor-pointer"
                    aria-label="滚动到文章部分"
                >
                    <p className="text-sm mt-3 text-center font-medium drop-shadow-lg pb-3 text-black/70 dark:text-white">
                        查看文章
                    </p>
                    <span className="text-4xl relative left-2 text-black/70 dark:text-white/70">
                        <FaAngleDoubleDown />
                    </span>
                </button>
            </motion.div>
        </article>
    )

}