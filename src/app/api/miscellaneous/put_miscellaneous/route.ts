import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, content,date } = body;
        if (!id || !content) {
            return NextResponse.json({ error: 'Missing id or content' }, { status: 400 });
        }
        const miscellaneous = await prisma.miscellaneous.update({
            where: {
                id: id,
            },
            data: {
                content: content,
                date:date,
            }
        });
        return NextResponse.json(miscellaneous);
    } catch (error) {
        console.error('更新杂项失败:', error);
        return NextResponse.json(
            { message: 'Failed to update miscellaneous' },
            { status: 400 }
        );

    }

}