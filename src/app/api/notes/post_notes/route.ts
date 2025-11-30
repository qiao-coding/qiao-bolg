import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, tags, createdAt } = body;
        if (!title || !tags || !createdAt) {
            return NextResponse.json({ error: "标题、标签和创建时间不能为空" }, { status: 400 });
        }

        const res = await prisma.note.create({
            data: body
        });
        return NextResponse.json(res);
    } catch (error) {
        console.error("创建笔记失败:", error);
        return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
    }
    
}