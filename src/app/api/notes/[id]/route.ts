import { prisma } from "@/lib/prisma";
import {  NextRequest, NextResponse } from "next/server";


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {

        const { id } = await params

        const noteId = Number(id)



        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: "无效ID" }, { status: 400 });
        }
        const res = await prisma.note.findUnique({
            where: {
                id: noteId
            },
            include: {
                page: true
            }

        })
        if (!res) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        return NextResponse.json(res);
    } catch (error) {
        console.error('获取Note失败:', error);
        return NextResponse.json({ error: "获取失败" }, { status: 500 });

    }

}