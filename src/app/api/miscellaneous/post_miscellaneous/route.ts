import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma=new PrismaClient();
export async function POST(Request: NextRequest) {
   try {
    const body = await Request.json();
    const { id, content } = body;

    if (!body.content) {
        return new Response(JSON.stringify({ error: '内容不能为空' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const miscellaneous = await prisma.miscellaneous.create({
        data: {
            id: id,
            content: content,
            date: new Date().toISOString().slice(0, 10),
        }
    });
    return NextResponse.json(miscellaneous);
    
   } catch (error) {
        console.error('创建杂项失败:', error);
        return NextResponse.json(
            { message: 'Failed to create miscellaneous' },
            { status: 400 }
        );

    
   }

}