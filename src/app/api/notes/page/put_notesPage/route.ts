import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { title } = body;
        const {id,noteId,...data } = body;

        if (!id || !title ) {
            
            return new Response('缺少必要的参数', { status: 400 });
        }


        await prisma.note.update({
            where: {
                id: noteId
            },
            data: {
                page: {
                    upsert: {
                        where: {
                            id: id
                        },
                        update:data,
                        create: data

                    }
                }
            },
            include: {
                page: true,
            },
        })
        return NextResponse.json({ message: '更新成功' }, { status: 200 });
    } catch (error) {
        console.error('更新笔记失败:', error);
    }
}