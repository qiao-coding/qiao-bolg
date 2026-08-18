import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, id, noteId, ...data } = body;

    if (!id || !title) {
      return new Response('缺少必要的参数', { status: 400 });
    }

    // 直接更新笔记页并重挂 noteId，支持跨分类移动
    // （原实现用 prisma.note.update + 嵌套 upsert，跨分类时走 create 分支导致页面被复制而非移动）
    await prisma.notesPage.update({
      where: { id },
      data: { ...data, noteId },
    });

    return NextResponse.json({ message: '更新成功' }, { status: 200 });
  } catch (error) {
    console.error('更新笔记失败:', error);
    return NextResponse.json({ message: '更新失败' }, { status: 500 });
  }
}
