import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
    try{
        const miscellaneous = await prisma.miscellaneous.findMany();
        return NextResponse.json(miscellaneous);
    }catch(error){
        console.error('Error fetching miscellaneous from DB:', error);
        return NextResponse.json(
            {message:'Internal server error'},
            {status:500}
        );
    }
}