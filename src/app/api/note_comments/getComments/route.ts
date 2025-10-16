import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
    const comments = await prisma.publicComment.findMany({
        orderBy: {
            createdAt: 'asc',
        },
    });
    return NextResponse.json(comments);
}