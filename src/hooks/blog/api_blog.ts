import { BlogData, BlogDataStruct } from "@/types/blog/type";

function createBlog() {
  // 获取博客设置数据
  async function getBlog(props?: RequestInit) {
    try {
      const res = await fetch('/api/blog', {
        ...props
      });

      if (!res.ok) {
        throw new Error('博客设置数据获取失败');
      }
      const data = await res.json();

      return data;
    } catch (error) {
      console.error('获取博客设置数据失败:', error);
      throw error;
    }
  }

  // 更新博客设置数据
  async function postBlog(blogData: BlogDataStruct) {
    try {
      const res = await fetch('/api/blog/post_blog', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(blogData)
      });

      if (!res.ok) {
        throw new Error('更新博客设置失败');
      }

      const data = (await res.json()) as BlogData;
      return data;
    } catch (error) {
      console.error('更新博客设置失败:', error);
      throw error;
    }
  }

  return {
    getBlog,
    postBlog
  };
}

export const api_blog = createBlog();