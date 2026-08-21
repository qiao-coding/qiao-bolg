import NextRouter from "@/components/layout/NextRouter";
import { HomeZhuyepage } from "@/components/features/home/homeZhuyepage";
import HomeArticles from "@/components/features/home/homeArticles";
import TechBackgroundNoGrid from "@/components/ui/public/background_img";
// 首页组件 - 提供网站入口和内容展示

function Home() {
  return (
    <TechBackgroundNoGrid>
      {/* 主要内容区域 - 包含首页头部和文章列表 */}
      <main className="min-h-screen">
        <NextRouter>
          {/* 首页区域  */}
          <HomeZhuyepage />
          {/* 文章列表区域 - 展示博客文章内容 */}
          <section className="pt-16 pb-0 mx-auto">
            <HomeArticles />
          </section>
        </NextRouter>
      </main>
    </TechBackgroundNoGrid>
  );
}

export const generateStaticParams = () => {
  return [{ locale: 'zh' }, { locale: 'en' }];
};

export const dynamicParams = false;

export const revalidate = false;

export default Home;