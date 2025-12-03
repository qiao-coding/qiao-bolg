'use client'
import { FaAngleDoubleDown } from "react-icons/fa";
import { motion } from "framer-motion";
import AnimatedContent from "@/components/ui/shadcnComponents/AnimatedContent";
import TiltedCard from "@/components/ui/shadcnComponents/TiltedCard";
import { useSession } from "next-auth/react";
import { VscGithub } from "react-icons/vsc";
import { SiGitee } from "react-icons/si";
import { SiTiktok } from "react-icons/si";
import { FaBilibili } from "react-icons/fa6";




export function HomeZhuyepage() {
    const { data: session } = useSession()

    const HomeIcon = [
        {

            icon: <VscGithub className="btn bg-black border-0 text-white rounded p-0 p-2 cursor-target mt-2 " />,
            link: "https://github.com/xier123456"
        },
        {
            icon: <SiGitee className="fill-current rounded text-3xl btn btn-soft btn-error p-2 hover:text-white cursor-target mt-2 " />
            ,
            link: "https://gitee.com/xier123456"
        },
        {
            icon: <SiTiktok className="btn hover:btn-neutral rounded hover:text-white fill-current text-4xl  p-2 cursor-target mt-2" />
            ,
            link: "https://www.douyin.com/user/self?from_tab_name=main&showTab=post"
        },
        {
            icon: <FaBilibili className="fill-current rounded  text-3xl p-2 btn btn-soft btn-secondary cursor-target mt-2" />,
            link: "https://space.bilibili.com/3493288889813717?spm_id_from=333.1007.0.0"
        }
    ]
    return (
        <article className={` min-h-screen bg-cover homebg bg-center bg-no-repeat  to-white   min-h-screen bg-cover `}>
            <AnimatedContent
                distance={150}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                scale={1}
                threshold={0.1}
                delay={0}
            >
                <section className="hero min-h-screen dark:bg-black/60 p-6" >
                    <div className="hero-content flex-col lg:flex-row-reverse gap-22">
                        <figure className="cursor-target">
                            <TiltedCard
                                imageSrc={(session && session.user?.image) || '/UserImage/up.jpg'}
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
                            <h1 className="mt-2 text-5xl font-bold text-center">
                                Hi!  {session?.user?.name || 'HaoWhite'} 🥰
                            </h1>

                            <p className="py-6">愿生活的每一天，都有惊喜!</p>
                            <nav className="flex gap-10 justify-center">
                                {HomeIcon.map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`跳转到 ${item.link}`}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: -5, transition: { duration: 0.3 }, translateY: -10 }}
                                        >
                                            {item.icon}
                                        </motion.div>
                                    </a>
                                ))}
                            </nav>
                        </header>
                    </div>
                </section>
            </AnimatedContent>
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