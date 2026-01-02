import NextRouter from "@/components/layout/NextRouter";
import { HomeZhuyepage } from "@/components/features/home/homeZhuyepage";
import HomeArticles from "@/components/features/home/homeArticles";

// 首页组件 - 提供网站入口和内容展示
function Home() {
  return (
    <>
      {/* 主要内容区域 - 包含首页头部和文章列表 */}
      <main className="min-h-screen bg-cover bg-center bg-sky-100/60 dark:bg-gray-700/60">
        <NextRouter>
          {/* 首页头部区域 - 包含导航、标题等 */}
          <HomeZhuyepage />
          {/* 文章列表区域 - 展示博客文章内容 */}
          <section id="articles-section" className={`backdrop-blur-sm py-16 pb-30`}>
            <HomeArticles />
          </section>
        </NextRouter>
      </main>
    </>
  );
}

//ssg构建
export const generateStaticParams = () => {
  return [{ id: 1 }];
};// 变静态文件，提前构建

// 动态路由参数
export const dynamicParams = false;

// 重新验证时间
export const revalidate = false;

export default Home;