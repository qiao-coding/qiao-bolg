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
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });


    }

}