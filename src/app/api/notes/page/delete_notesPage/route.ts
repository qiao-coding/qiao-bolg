import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";


export async function DELETE(req: NextRequest) {
    try {
        const rawBody = await req.json();

        const { pageID } = rawBody;
        
        if (!rawBody) {
            return NextResponse.json({ error: "请求体格式不正确" }, { status: 400 });
        }

        
        if (!pageID) {
            return NextResponse.json({ error: "缺少或非法的pageID" }, { status: 400 });
        }

        const pagelistID = await prisma.notesPage.findUnique({
            where: {
                pageId: pageID,
            },
        })

        if(!pagelistID) {
            return NextResponse.json({ error: "页面不存在" }, { status: 400 });
        }

        await prisma.notesPage.delete({
            where: {
                pageId: pageID,
            },
        });

        return NextResponse.json({ message: "删除成功" }, { status: 200 });
    } catch (error) {

        console.error("删除笔记页面失败:", error);
        return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
    }
}