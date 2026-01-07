import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const res = await prisma.friend.findMany()
        return NextResponse.json(res);

    } catch (err) {
        console.error('获取好友列表失败:', err);
        return NextResponse.json(
            { message: 'Failed to get friend list' },
            { status: 400 }
        );
    }

}