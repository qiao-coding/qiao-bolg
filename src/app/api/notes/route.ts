import { prisma } from "@/lib/prisma";


export async function GET() {
    try {
    const res=await prisma.note.findMany({
        include:{
            page:true
        }
    })
    return Response.json(res)
    } catch (error) {
        return Response.json({error:"获取失败"})
    }
    
}