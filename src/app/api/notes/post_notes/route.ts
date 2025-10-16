import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, content, tags, createdAt } = body;
        if (!title || !content || !tags || !createdAt) {
            return Response.json({ error: "标题、内容、标签和创建时间不能为空" });
        }
        const res = await prisma.note.create({
            data: body
        })
        return NextResponse.json(res)
    } catch (error) {
        
    }
    
}