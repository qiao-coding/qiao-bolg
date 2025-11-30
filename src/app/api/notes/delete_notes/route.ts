import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest) {

    try {
        const { id } = await req.json();

        if(!id){
            return new Response(JSON.stringify({ error: '缺少id' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await prisma.note.delete({
            where: {
                id: Number(id)
            },
            include: {
                page: true
            }
        })

        return NextResponse.json({ message: '删除成功' }, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {

    }

}