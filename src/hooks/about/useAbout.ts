import { AboutDeta } from "@/types/about/type";
import { AboutPage } from "@prisma/client";

function createAbout() {
  // 获取关于页面数据
  async function getAbout(props?: RequestInit) {
    try {
      const res = await fetch('/api/about', {
        ...props
      });

      if (!res.ok) {
        throw new Error('关于页面数据获取失败');
      }
      const data = await res.json();

      return data;
    } catch (error) {
      console.error('获取关于页面数据失败:', error);
      throw error;
    }
  }

  // 更新关于页面数据
  async function postAbout(aboutData: AboutDeta){
    try {
      const res = await fetch('/api/about/post_about', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(aboutData)
      });

      if (!res.ok) {
        throw new Error('更新关于页面失败');
      }

      const data = (await res.json()) as AboutPage;
      return data;
    } catch (error) {
      console.error('更新关于页面失败:', error);
      throw error;
    }
  }

  return {
    getAbout,
    postAbout
  };
}

export const useAbout = createAbout();