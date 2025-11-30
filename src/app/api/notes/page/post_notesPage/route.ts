import { prisma } from "@/lib/prisma";
import { NotesPage } from "@/types/note/type";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title } = body;
        const { id, noteId, ...nopages } = body

        if (!title || !body.uid || !noteId) {
            return new Response('缺少必要的参数', { status: 400 });
        }

        await prisma.note.update({
            where: {
                id: Number(noteId)
            },
            data: {
                page: {
                    create: nopages
                }
            },
            include: {
                page: true
            }
        }
        )

        return NextResponse.json({ message: '笔记创建成功' }, { status: 200 });
    } catch (error) {
        console.error('创建笔记失败:', error);
    }
}