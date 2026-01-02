import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

// 获取博客设置数据
export async function GET() {
  try {
    // 默认使用ID为1的记录
    const blogId = 1;

    // 从 cookies 获取语言设置
    const cookieStore = await cookies();
    const locale = cookieStore.get('preferred-locale')?.value || 'zh';

    // 获取博客设置数据
    const blogSetting = await prisma.blogSetting.findUnique({
      where: { id: blogId },
      include: {
        homePage: true,
        homeIcons: {
          orderBy: {
            order: 'asc'
          }
        },
        notesSidebar: {
          include: {
            socialLinks: {
              orderBy: {
                order: 'asc'
              }
            },
            
          }
        }
      }
    });

    // 多语言默认数据
    const getDefaultData = (lang: string) => {
      const defaultTexts = {
        zh: {
          blogName: "HaoWhiteの小站",
          mainTitle: "Hi! HaoWhite 🥰",
          subTitle: "愿生活的每一天，都有惊喜!",
        },
        en: {
          blogName: "HaoWhite's Blog",
          mainTitle: "Hi! HaoWhite 🥰",
          subTitle: "May every day of life bring surprises!",
        },
        jp: {
          blogName: "HaoWhiteのブログ",
          mainTitle: "こんにちは！HaoWhite 🥰",
          subTitle: "生活の毎日に驚きがありますように！",
        }
      };

      return defaultTexts[lang as keyof typeof defaultTexts] || defaultTexts.zh;
    };

    const defaultData = getDefaultData(locale);

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
              link: "https://gitee.com/xier123456",
            }
          ],
          isDynamicEmail: true,
          isDynamicName: true,
        }
      });
    }

    // 如果找到数据，但需要根据语言返回相应内容
    const response = {
      blogName: blogSetting.blogName || defaultData.blogName,
      homePage: blogSetting.homePage ? {
        mainTitle: blogSetting.homePage.mainTitle || defaultData.mainTitle,
        subTitle: blogSetting.homePage.subTitle || defaultData.subTitle,
        isDynamicTitle: blogSetting.homePage.isDynamicTitle,
        isDynamicTiltCard: blogSetting.homePage.isDynamicTiltCard,
      } : {
        mainTitle: defaultData.mainTitle,
        subTitle: defaultData.subTitle,
        isDynamicTitle: true,
        isDynamicTiltCard: true,
      },
      homeIcons: blogSetting.homeIcons.map(icon => ({
        id: icon.id,
        name: icon.name,
        link: icon.link,
      })),
      notesSidebar: blogSetting.notesSidebar ? {
        name: blogSetting.notesSidebar.name,
        email: blogSetting.notesSidebar.email,
        isDynamicEmail: blogSetting.notesSidebar.isDynamicEmail,
        isDynamicName: blogSetting.notesSidebar.isDynamicName,
        
        socialLinks: blogSetting.notesSidebar.socialLinks ? blogSetting.notesSidebar.socialLinks.map(socialLink => ({
          id: socialLink.id,
          name: socialLink.name,
          link: socialLink.link,
        })) : []
      } : null
    };

    return Response.json(response);
  } catch (error) {
    console.error("获取博客设置数据失败:", error);
    return Response.json({ error: "获取数据失败" }, { status: 500 });
  }
}

// 更新博客设置数据
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blogName, homePage, homeIcons, notesSidebar } = body;

    // 默认使用ID为1的记录
    const blogId = 1;

    // 检查是否存在博客设置数据
    const existingBlogSetting = await prisma.blogSetting.findUnique({
      where: { id: blogId },
      include: {
        homePage: true,
        notesSidebar: {
          include: {
            contacts: true,
            socialLinks: true
          }
        }
      }
    });

    let updatedBlogSetting;

    if (existingBlogSetting) {
      // 更新现有记录
      const updateData: Prisma.BlogSettingUpdateInput = {
        blogName: blogName,
        homeIcons: {
          deleteMany: {}, // 删除所有现有的图标
          create: homeIcons.map((icon: { name: string; link: string }, index: number) => ({
            name: icon.name,
            link: icon.link,
            order: index
          }))
        }
      };

      // 处理homePage的更新或创建
      if (homePage) {
        if (existingBlogSetting.homePage) {
          updateData.homePage = {
            update: {
              mainTitle: homePage.mainTitle,
              subTitle: homePage.subTitle,
              isDynamicTitle: homePage.isDynamicTitle !== undefined ? homePage.isDynamicTitle : true,
              isDynamicTiltCard: homePage.isDynamicTiltCard !== undefined ? homePage.isDynamicTiltCard : true,
            }
          };
        } else {
          updateData.homePage = {
            create: {
              mainTitle: homePage.mainTitle,
              subTitle: homePage.subTitle,
              isDynamicTitle: homePage.isDynamicTitle !== undefined ? homePage.isDynamicTitle : true,
              isDynamicTiltCard: homePage.isDynamicTiltCard !== undefined ? homePage.isDynamicTiltCard : true,
            }
          };
        }
      }

      // 处理notesSidebar的更新或创建
      if (notesSidebar) {
        const socialLinksData = notesSidebar.socialLinks ? {
          deleteMany: {}, // 删除所有现有的社交链接
          create: notesSidebar.socialLinks.map((contact: { name: string; link: string }, index: number) => ({
            name: contact.name,
            link: contact.link,
            order: index
          }))
        } : undefined;
        
        const notesSidebarUpdateData = {
          name: notesSidebar.name,
          email: notesSidebar.email,
          isDynamicEmail: notesSidebar.isDynamicEmail !== undefined ? notesSidebar.isDynamicEmail : true,
          isDynamicName: notesSidebar.isDynamicName !== undefined ? notesSidebar.isDynamicName : true,
          ...(socialLinksData && { socialLinks: socialLinksData })
        };
        
        if (existingBlogSetting.notesSidebar) {
          updateData.notesSidebar = {
            update: notesSidebarUpdateData
          };
        } else {
          updateData.notesSidebar = {
            create: notesSidebarUpdateData
          };
        }
      }

      updatedBlogSetting = await prisma.blogSetting.update({
        where: { id: blogId },
        data: updateData,
        include: {
          homePage: true,
          homeIcons: true,
          notesSidebar: {
            include: {
              contacts: true,
              socialLinks: true
            }
          }
        }
      });
    } else {
      // 创建新记录
      updatedBlogSetting = await prisma.blogSetting.create({
        data: {
          id: blogId,
          blogName: blogName,
          homePage: homePage ? {
            create: {
              mainTitle: homePage.mainTitle,
              subTitle: homePage.subTitle,
              isDynamicTitle: homePage.isDynamicTitle !== undefined ? homePage.isDynamicTitle : true,
              isDynamicTiltCard: homePage.isDynamicTiltCard !== undefined ? homePage.isDynamicTiltCard : true,
            }
          } : undefined,
          homeIcons: {
            create: homeIcons.map((icon: { name: string; link: string }, index: number) => ({
              name: icon.name,
              link: icon.link,
              order: index
            }))
          },
          notesSidebar: notesSidebar ? {
            create: {
              name: notesSidebar.name,
              email: notesSidebar.email,
              contacts: {
                create: notesSidebar.contacts.map((contact: { name: string; link: string }, index: number) => ({
                  name: contact.name,
                  link: contact.link,
                  order: index
                }))
              }
            }
          } : undefined
        },
        include: {
          homePage: true,
          homeIcons: true,
          notesSidebar: {
            include: {
              contacts: true,
              socialLinks: true
            }
          }
        }
      });
    }

    return Response.json({
      blogName: updatedBlogSetting.blogName,
      homePage: updatedBlogSetting.homePage ? {
        mainTitle: updatedBlogSetting.homePage.mainTitle,
        subTitle: updatedBlogSetting.homePage.subTitle,
        isDynamicTitle: updatedBlogSetting.homePage.isDynamicTitle,
        isDynamicTiltCard: updatedBlogSetting.homePage.isDynamicTiltCard,
      } : null,
      homeIcons: updatedBlogSetting.homeIcons.map(icon => ({
        id: icon.id,
        name: icon.name,
        link: icon.link,
      })),
      notesSidebar: updatedBlogSetting.notesSidebar ? {
        name: updatedBlogSetting.notesSidebar.name,
        email: updatedBlogSetting.notesSidebar.email,
        isDynamicEmail: updatedBlogSetting.notesSidebar.isDynamicEmail,
        isDynamicName: updatedBlogSetting.notesSidebar.isDynamicName,
        
        socialLinks: updatedBlogSetting.notesSidebar.socialLinks ? updatedBlogSetting.notesSidebar.socialLinks.map(socialLink => ({
          id: socialLink.id,
          name: socialLink.name,
          link: socialLink.link,
        })) : []
      } : null
    });
  } catch (error) {
    console.error("保存博客设置数据失败:", error);
    return Response.json({ error: "保存数据失败" }, { status: 500 });
  }
}