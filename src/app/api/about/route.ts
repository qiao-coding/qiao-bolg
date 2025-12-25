import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

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

// 更新关于页面数据
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, details } = body;
    
    // 默认使用ID为1的记录
    const blogId = 1;
    
    // 检查是否存在关于页面数据
    const existingAboutPage = await prisma.aboutPage.findUnique({
      where: { id: blogId }
    });

    let aboutPage;
    
    if (existingAboutPage) {
      // 更新现有记录
      aboutPage = await prisma.aboutPage.update({
        where: { id: blogId },
        data: {
          description: description,
          details: {
            deleteMany: {}, // 删除所有现有的详情
            create: details.map((detail: { label: string; value: string }, index: number) => ({
              label: detail.label,
              value: detail.value,
              order: index
            }))
          }
        },
        include: {
          details: true
        }
      });
    } else {
      // 创建新记录
      aboutPage = await prisma.aboutPage.create({
        data: {
          id: blogId,
          description: description,
          details: {
            create: details.map((detail: { label: string; value: string }, index: number) => ({
              label: detail.label,
              value: detail.value,
              order: index
            }))
          }
        },
        include: {
          details: true
        }
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
    console.error("保存关于页面数据失败:", error);
    return Response.json({ error: "保存数据失败" }, { status: 500 });
  }
}