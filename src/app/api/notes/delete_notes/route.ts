import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseId(value: unknown): number | null {
    if (typeof value === "number" && Number.isInteger(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
        const n = Number(value);
        return Number.isInteger(n) ? n : null;
    }
    return null;
}

function isPrismaNotFoundError(error: unknown): boolean {
    const prismaError = error as Prisma.PrismaClientKnownRequestError | null;
    return prismaError?.code === "P2025";
}

export async function DELETE(req: NextRequest) {
    try {
        const rawBody: unknown = await req.json();
        if (!isRecord(rawBody)) {
            return NextResponse.json({ error: "请求体格式不正确" }, { status: 400 });
        }

        const id = parseId(rawBody.id);
        if (id === null) {
            return NextResponse.json({ error: "缺少或非法的id" }, { status: 400 });
        }

        await prisma.note.delete({
            where: { id },
        });

        return NextResponse.json({ message: "删除成功" }, { status: 200 });
    } catch (error) {
        if (isPrismaNotFoundError(error)) {
            return NextResponse.json({ message: "记录不存在或已删除" }, { status: 200 });
        }

        console.error("删除笔记失败:", error);
        return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
    }
}