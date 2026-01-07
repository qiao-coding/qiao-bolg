import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { id} = body;
        if (!id ) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        const miscellaneous = await prisma.miscellaneous.delete({
            where: {
                id: id,
            }
        })

        return NextResponse.json(miscellaneous)
    } catch (error) {
        console.error('删除杂项失败:', error);
        return NextResponse.json(
            { message: 'Failed to delete miscellaneous' },
            { status: 400 }
        );


    }

}