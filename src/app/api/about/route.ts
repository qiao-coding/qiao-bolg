import { prisma } from "@/lib/prisma";

// 获取关于页面数据
export async function GET() {
  try {
    // 默认使用ID为1的记录
    const blogId = 1;
    
    // 获取关于页面数据
    const aboutPage = await prisma.aboutPage.findUnique({
      where: { id: blogId },
      include: {
        details: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    // 如果没有找到数据，返回默认结构
    if (!aboutPage) {
      return Response.json({
        description: "你好！我是昊小白，一名热爱前端开发的前端小白",
        details: [
        
        ]
      });
    }

    return Response.json({
      description: aboutPage.description,
      details: aboutPage.details.map(detail => ({
        label: detail.label,
        value: detail.value
      }))
    });
  } catch (error) {
    console.error("获取关于页面数据失败:", error);
    return Response.json({ error: "获取数据失败" }, { status: 500 });
  }
}

