import { BlogDataStruct } from '@/types/blog/type';
import { useState, useEffect } from 'react';



export const useBlogData = () => {
  const [blogData, setBlogData] = useState<BlogDataStruct>({
    homePage: {
      mainTitle: 'Hi! HaoWhite 🥰',
      subTitle: '愿生活的每一天，都有惊喜!',
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
  const [isLoading, setIsLoading] = useState(true);

  // 获取博客设置数据
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch('/api/blog');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '获取数据失败');
        }

        // 设置 API 返回的数据，翻译将在组件层面处理
        setBlogData(data);
      } catch (error) {
        console.error('获取博客设置数据失败:', error);
        // 使用默认数据
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, []); // 空依赖数组，只在组件挂载时执行一次

  return { blogData, isLoading };
};
