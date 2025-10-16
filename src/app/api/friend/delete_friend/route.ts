import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req:NextRequest) {
    try {
        const body = await req.json();
        const res=await prisma.friend.delete({
            where:{
                id:body.id
            }
        })
        if (!res) {
            return NextResponse.json(
                { message: 'Failed to delete friend' },
                { status: 400 }
            );
        }
        return NextResponse.json(res);
    } catch (error) {
        
    }
    
}