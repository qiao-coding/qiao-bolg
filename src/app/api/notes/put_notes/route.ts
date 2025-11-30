import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, title} = body;

        console.log('更新笔记:', id, title);
        

        
        if (!id || !title ) {
            return new NextResponse('缺少必要的参数', { status: 400 });
        }

        await prisma.note.update({
            where: {
                id: id
            },
            data: {
                title: title,
            }
        })

        return NextResponse.json({ message: '更新成功' }, { status: 200 });

    } catch (error) {
        console.error('更新笔记失败:', error);
        if (error instanceof SyntaxError) {
            return new NextResponse('JSON格式错误', { status: 400 });
        }
        return new NextResponse('服务器内部错误', { status: 500 });
    }
}