import { prisma } from "@/lib/prisma";


export async function GET() {
    try {
        const res = await prisma.note.findMany({
            include: {
                page: true
            }
        })
        return Response.json(res)
    } catch (error) {
        console.error("获取笔记失败:", error);
        return Response.json({ error: "获取失败", details: process.env.NODE_ENV === 'development' ? String(error) : undefined }, { status: 500 });

}
    
}