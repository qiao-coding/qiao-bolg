import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const rawBody= await request.json();
        const { title, tags, titlePicture, createdAt } = rawBody 


        if (!title || !tags || tags.length === 0) {
            return NextResponse.json({ error: "标题和标签不能为空" }, { status: 400 });
        }

        const res = await prisma.note.create({
            data: {
                title,
                tags,
                ...(titlePicture ? { titlePicture } : {}),
                ...(createdAt ? { createdAt } : {}),
            },
        });

        return NextResponse.json(res);
    } catch (error) {
        console.error("创建笔记失败:", error);
        return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
    }
}