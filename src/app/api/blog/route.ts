import { cookies } from "next/headers";
import { getBlogSettings } from "@/lib/blog/blogSettings";

// 获取博客设置数据
export async function GET() {
  try {
    // 从 cookies 获取语言设置
    const cookieStore = await cookies();
    const locale = cookieStore.get("preferred-locale")?.value || "zh";

    // 多语言默认数据
    const defaultTexts = {
      zh: {
        blogName: "小小乔の小站",
        mainTitle: "Hi! xiaoxiaoqiao 🥰",
        subTitle: "愿生活的每一天，都有惊喜!",
      },
      en: {
        blogName: "小小乔の小站",
        mainTitle: "Hi! xiaoxiaoqiao 🥰",
        subTitle: "May every day of life bring surprises!",
      },
      jp: {
        blogName: "小小乔の小站",
        mainTitle: "こんにちは！xiaoxiaoqiao 🥰",
        subTitle: "生活の毎日に驚きがありますように！",
      },
    };

    const defaultData = defaultTexts[locale as keyof typeof defaultTexts] || defaultTexts.zh;

    const blogSetting = await getBlogSettings();

    // 如果没有找到数据，返回默认结构
    if (!blogSetting) {
      return Response.json({
        blogName: defaultData.blogName,
        homePage: {
          mainTitle: defaultData.mainTitle,
          subTitle: defaultData.subTitle,
          isDynamicTitle: true,
          isDynamicTiltCard: true,
        },
        homeIcons: [
          { id: 1, name: "GitHub", link: "https://github.com/xier123456" },
          { id: 2, name: "Gitee", link: "https://gitee.com/xier123456" },
          {
            id: 3,
            name: "抖音",
            link: "https://www.douyin.com/user/self?from_tab_name=main&showTab=post",
          },
          {
            id: 4,
            name: "哔哩哔哩",
            link: "https://space.bilibili.com/3493288889813717?spm_id_from=333.1007.0.0",
          },
        ],
        notesSidebar: {
          name: "昊小白",
          email: "haobaixiao@example.com",
          socialLinks: [
            { id: 1, name: "GitHub", link: "https://github.com/xier123456" },
            { id: 2, name: "Gitee", link: "https://gitee.com/xier123456" },
          ],
          isDynamicEmail: true,
          isDynamicName: true,
        },
      });
    }

    // 根据语言返回相应内容
    return Response.json({
      blogName: blogSetting.blogName || defaultData.blogName,
      homePage: blogSetting.homePage
        ? {
            mainTitle: blogSetting.homePage.mainTitle || defaultData.mainTitle,
            subTitle: blogSetting.homePage.subTitle || defaultData.subTitle,
            isDynamicTitle: blogSetting.homePage.isDynamicTitle,
            isDynamicTiltCard: blogSetting.homePage.isDynamicTiltCard,
          }
        : {
            mainTitle: defaultData.mainTitle,
            subTitle: defaultData.subTitle,
            isDynamicTitle: true,
            isDynamicTiltCard: true,
          },
      homeIcons: blogSetting.homeIcons,
      notesSidebar: blogSetting.notesSidebar,
    });
  } catch (error) {
    console.error("获取博客设置数据失败:", error);
    return Response.json({ error: "获取数据失败" }, { status: 500 });
  }
}
