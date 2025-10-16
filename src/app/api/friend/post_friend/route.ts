
// 确保正确导入prisma
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const body = await req.json();
        
        if (!body.name || !body.url) {
            return NextResponse.json(
                { message: '名称和URL是必填字段' },
                { status: 400 }
            );
        }
        
        const friendData = {
            name: body.name,
            url: body.url,
            avatar: body.avatar || '', 
            bio: body.bio || '',       
            status: body.status || false 
        };
        
        const res = await prisma.friend.create({
            data: friendData
        });
        
        if (!res) {
            return NextResponse.json(
                { message: 'Failed to create friend' },
                { status: 400 }
            );
        }
        return NextResponse.json(res);

    } catch (error) {
        console.error('创建友链时出错:', error);
        return NextResponse.json(
            { 
                message: 'Failed to create friend', 
                error: error instanceof Error ? error.message : '未知错误'
            },
            { status: 500 }
        );
    }
}

