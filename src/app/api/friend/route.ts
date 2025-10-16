import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const res = await prisma.friend.findMany()
        return NextResponse.json(res);

    } catch (err) {
    }

}