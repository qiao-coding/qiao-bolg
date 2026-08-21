import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const res = await prisma.note.findMany({
            include: {
                page: true
            }
        })
        return Response.json(res, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        })
    } catch (error) {
        console.error("获取笔记失败:", error);
        return Response.json({ error: "获取失败", details: process.env.NODE_ENV === 'development' ? String(error) : undefined }, { status: 500 });

}
    
}
