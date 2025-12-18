import NextRouter from "@/components/layout/NextRouter";
import { HomeZhuyepage } from "@/components/features/home/homeZhuyepage";
import HomeArticles from "@/components/features/home/homeArticles";



function Home() {
  return (
    <>

      <main className="min-h-screen bg-cover bg-center bg-sky-100/60 dark:bg-gray-700/60">
     
        <NextRouter>
          <HomeZhuyepage />

          <article id="articles-section" className={`  backdrop-blur-sm py-16 pb-30`}>
            <HomeArticles />
          </article>
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