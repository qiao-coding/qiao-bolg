'use client'
import { FaAngleDoubleDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { SiGitee, SiGithub } from "react-icons/si";
import { SiTiktok } from "react-icons/si";
import { FaBilibili } from "react-icons/fa6";
import HomeCard from "./homeCard";
import { useBlogDataContext } from "@/components/layout/BlogDataProvider";
import { useEffect, useMemo, useState } from "react";


export function HomeZhuyepage() {
    const { data: session } = useSession()
    const { blogData } = useBlogDataContext();
    const [image, setImage] = useState('/user_img/up.jpg');


    //标题
    const handleTitle = () => {
        if (blogData?.homePage?.isDynamicTitle) {
            return session && `Hi ${session.user?.name} 🥰` || 'Hi HaoWhite 🥰';
        }
        return blogData?.homePage?.mainTitle || 'Hi HaoWhite ';
    }

    //homeCard图片
    useEffect(() => {
        if (session?.user?.image && blogData?.homePage?.isDynamicTiltCard) {
            setImage(session.user.image);
        } else {
            // 当条件不满足时，重置为默认图片
            setImage('/user_img/up.jpg');
        }
    }, [session?.user?.image, blogData?.homePage?.isDynamicTiltCard])

    //图标
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
    }


    return (
        <article
            style={{
                backgroundImage: `url(/bg.webp)`,
                backgroundAttachment: 'fixed',
            }}
            className={` min-h-screen bg-cover  bg-center bg-no-repeat  to-white   min-h-screen bg-cover `}>

            <section className="hero min-h-screen dark:bg-black/60 p-6" >
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="hero-content flex-col lg:flex-row-reverse gap-22">
                    <figure className="cursor-target">
                        <HomeCard
                            imageSrc={useMemo(() => image, [image])}
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
                        <h1 className="mt-2 text-3xl md:text-5xl font-bold text-center text-slate-700 dark:text-white">
                            {handleTitle()}
                        </h1>

                        <p className="py-6 text-lg text-slate-600 dark:text-slate-300">{blogData?.homePage?.subTitle || "愿生活的每一天，都有惊喜!"}</p>
                        <nav className="flex gap-10 justify-center">
                            {blogData?.homeIcons?.map((icon, index) => (
                                <a
                                    key={index}
                                    href={icon.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`跳转到 ${icon.name}`}
                                >
                                    <motion.div
                                        className="cursor-target txet-black "
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
                <motion.button
                    className="group cursor-target transform transition-all duration-300 hover:scale-110 cursor-pointer"
                    aria-label="滚动到文章部分"
                    onClick={() => window.scrollTo({
                        top: window.innerHeight,
                        behavior: 'smooth'
                    })}
                >
                    <p className="text-sm mt-3 text-center font-medium drop-shadow-lg pb-3 text-black/70 dark:text-white">
                        查看文章
                    </p>
                    <span className="text-4xl relative left-2 text-black/70 dark:text-white/70">
                        <FaAngleDoubleDown />
                    </span>
                </motion.button>
            </motion.div>
        </article>
    )

}