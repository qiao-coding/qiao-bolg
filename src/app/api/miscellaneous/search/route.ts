import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "搜索查询参数 'q' 是必需的" }, { status: 400 });
    }

    // 搜索 Miscellaneous 表的内容和日期字段
    const miscellaneous = await prisma.miscellaneous.findMany({
      where: {
        OR: [
          {
            content: {
              contains: query,
              mode: "insensitive", // 不区分大小写
            },
          },
          {
            date: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    return NextResponse.json(miscellaneous);
  } catch (error) {
    console.error("搜索说说失败:", error);
    return NextResponse.json(
      { 
        error: "搜索失败", 
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined 
      }, 
      { status: 500 }
    );
  }
}