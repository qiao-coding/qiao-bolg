import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";


export async function DELETE(req: NextRequest) {

    const {  pageID } = await req.json()

    if ( !pageID) {
        return new Response('缺少必要的参数', { status: 400 });
    }


    await prisma.notesPage.delete({
        where: {
            pageId: pageID,
        },
    })
}