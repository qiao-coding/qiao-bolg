'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/shadcnComponents/forms/button";
import { Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { BlogBasicInfo } from '@/components/features/admin/blog/BlogBasicInfo';
import { HomeIcons } from '@/components/features/admin/blog/HomeIcons';
import { SidebarSettings } from '@/components/features/admin/blog/SidebarSettings';
import type { BlogData } from '@/types/blog/type';
import { useBlog } from '@/hooks/blog/useBlog';

export default function AdminBlogPage() {
  const { data: session } = useSession();
  const [blogData, setBlogData] = useState<BlogData>({
    // 博客基本信息
    blogName: "HaoWhiteの小站",
    // 主页信息
    homePage: {
      mainTitle: "Hi! HaoWhite 🥰",
      subTitle: "愿生活的每一天，都有惊喜!",
      isDynamicTitle: true,
      isDynamicTiltCard: true,
    },
    // 主页icons
    homeIcons: [
      {
        id: 1,
        name: "GitHub",
        link: "https://github.com/xier123456",
      },
      {
        id: 2,
        name: "Gitee",
        link: "https://gitee.com/xier123456",
      },
      {
        id: 3,
        name: "抖音",
        link: "https://www.douyin.com/user/self?from_tab_name=main&showTab=post",
      },
      {
        id: 4,
        name: "哔哩哔哩",
        link: "https://space.bilibili.com/3493288889813717?spm_id_from=333.1007.0.0",
      }
    ],
    // Notes侧边栏
    notesSidebar: {
      name: "昊小白",
      email: "haobaixiao@example.com",
      socialLinks: [
        {
          id: 1,
          name: "GitHub",
          link: "https://github.com/xier123456",
        },
        {
          id: 2,
          name: "Gitee",
          link: "https://xier123456.github.io/",
        },
      ],
      isDynamicEmail: true,
      isDynamicName: true,
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  // 页面加载时获取数据
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const data= await useBlog.getBlog(); // 假设 useBlog 是你的API调用函数

        // 合并API返回的数据和本地默认数据
        setBlogData({
          blogName: data.blogName || "HaoWhite",
          homePage: {
            mainTitle: data.homePage?.mainTitle || "Hi! HaoWhite 🥰",
            subTitle: data.homePage?.subTitle || "愿生活的每一天，都有惊喜!",
            isDynamicTitle: data.homePage?.isDynamicTitle ?? true,
            isDynamicTiltCard: data.homePage?.isDynamicTiltCard ?? true,
          },
          homeIcons: data.homeIcons,
          notesSidebar: {
            name: data.notesSidebar?.name || session?.user?.name || "",
            email: data.notesSidebar?.email || session?.user?.email || "",
            socialLinks: data.notesSidebar?.socialLinks || [],
            isDynamicEmail: data.notesSidebar?.isDynamicEmail ?? true,
            isDynamicName: data.notesSidebar?.isDynamicName ?? true,
          }
        })
      } catch (error) {
        console.error('获取博客设置数据失败:', error);
      }
    };
    fetchBlogData();
  }, [session?.user?.email, session?.user?.name]);

  // 处理博客名称变更
  const handleBlogNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlogData({
      ...blogData,
      blogName: e.target.value
    });
  };

  // 处理主页标题变更
  const handleHomePageChange = (field: 'mainTitle' | 'subTitle', value: string) => {
    setBlogData({
      ...blogData,
      homePage: {
        ...blogData.homePage,
        [field]: value
      }
    });
  };

  // 处理主页图标链接变更
  const handleHomeIconChange = (id: number, field: 'name' | 'link', value: string) => {
    const updatedIcons = blogData.homeIcons.map(icon =>
      icon.id === id ? { ...icon, [field]: value } : icon
    );
    setBlogData({
      ...blogData,
      homeIcons: updatedIcons
    });
  };

  // 处理侧边栏信息变更
  const handleSidebarChange = (field: 'name' | 'email', value: string) => {
    setBlogData({
      ...blogData,
      notesSidebar: {
        ...blogData.notesSidebar,
        [field]: value
      }
    });
  };

  // 处理侧边栏联系信息变更
  const handleContactChange = (id: number, field: 'name' | 'link', value: string) => {
    const updatedContacts = blogData.notesSidebar.socialLinks.map(contact =>
      contact.id === id ? { ...contact, [field]: value } : contact
    );
    setBlogData({
      ...blogData,
      notesSidebar: {
        ...blogData.notesSidebar,
        socialLinks: updatedContacts
      }
    });
  };

  // 处理动态标题开关变更
  const handleDynamicTitleChange = (checked: boolean) => {
    setBlogData({
      ...blogData,
      homePage: {
        ...blogData.homePage,
        isDynamicTitle: checked,
      },
    });
  };

  // 处理动态倾斜卡片开关变更
  const handleDynamicTiltCardChange = (checked: boolean) => {
    setBlogData({
      ...blogData,
      homePage: {
        ...blogData.homePage,
        isDynamicTiltCard: checked,
      },
    });
  };

  // 处理动态名称开关变更
  const handleDynamicNameChange = (checked: boolean) => {
    setBlogData({
      ...blogData,
      notesSidebar: {
        ...blogData.notesSidebar,
        isDynamicName: checked,
      },
    });
  };

  // 处理动态邮箱开关变更
  const handleDynamicEmailChange = (checked: boolean) => {
    setBlogData({
      ...blogData,
      notesSidebar: {
        ...blogData.notesSidebar,
        isDynamicEmail: checked,
      },
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 准备要保存的数据
      const saveData = {
        blogName: blogData.blogName,
        homePage: {
          mainTitle: blogData.homePage.mainTitle,
          subTitle: blogData.homePage.subTitle,
          isDynamicTitle: blogData.homePage.isDynamicTitle,
          isDynamicTiltCard: blogData.homePage.isDynamicTiltCard,
        },
        homeIcons: blogData.homeIcons.map(icon => ({
          name: icon.name,
          link: icon.link,
        })),
        notesSidebar: {
          name: blogData.notesSidebar.name,
          email: blogData.notesSidebar.email,
          isDynamicEmail: blogData.notesSidebar.isDynamicEmail,
          isDynamicName: blogData.notesSidebar.isDynamicName,
          socialLinks: blogData.notesSidebar.socialLinks.map(contact => ({
            name: contact.name,
            link: contact.link,
          }))
        }
      };

      // 调用API保存数据

       await useBlog.postBlog(saveData);

      // 刷新数据
      alert('保存成功');

    } catch (error) {
      console.error('保存博客设置数据失败:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-sky-100/60 dark:bg-gray-900/60 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">博客管理</h1>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? '保存中...' : '保存更改'}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* 博客基本信息 */}
          <BlogBasicInfo
            blogData={blogData}
            onBlogNameChange={handleBlogNameChange}
            onHomePageChange={handleHomePageChange}
            onDynamicTitleChange={handleDynamicTitleChange}
            onDynamicTiltCardChange={handleDynamicTiltCardChange}
          />

          {/* 主页图标链接 */}
          <HomeIcons
            homeIcons={blogData.homeIcons}
            onHomeIconChange={handleHomeIconChange}
          />

          {/* 侧边栏设置 */}
          <SidebarSettings
            notesSidebar={blogData.notesSidebar}
            onSidebarChange={handleSidebarChange}
            onContactChange={handleContactChange}
            onDynamicNameChange={handleDynamicNameChange}
            onDynamicEmailChange={handleDynamicEmailChange}
          />

          
        </div>
      </div>
    </div>
  );
}