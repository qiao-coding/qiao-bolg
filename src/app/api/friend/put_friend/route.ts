import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req:NextRequest) {
    try {
        const body = await req.json();
        const res=await prisma.friend.update({
            where:{
                id:body.id
            },
            data:body
        })
        if (!res) {
            return NextResponse.json(
                { message: 'Failed to update friend' },
                { status: 400 }
            );
        }
        return NextResponse.json(res);
    } catch (error) {
        console.error('更新好友失败:', error);
        return NextResponse.json(
            { message: 'Failed to update friend' },
            { status: 400 }
        );
        
    }
    
}