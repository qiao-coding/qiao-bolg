import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

function parseId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    return Number.isInteger(n) ? n : null;
  }
  return null;
}

function isPrismaNotFoundError(error: unknown): boolean {
  const prismaError = error as Prisma.PrismaClientKnownRequestError | null;
  return prismaError?.code === 'P2025';
}

export async function PUT(request: Request) {
  try {
    const { id, isDynamicEmail } = await request.json();

    const parsedId = parseId(id);

    if (parsedId === null) {
      return NextResponse.json(
        { error: '用户ID不能为空或格式不正确' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.adminUser.update({
      where: { id: parsedId },
      data: { isDynamicEmail }
    });

    return NextResponse.json({ 
      message: '更新成功',
      user: {
        id: updatedUser.id.toString(),
        username: updatedUser.username,
        isDynamicEmail: updatedUser.isDynamicEmail
      }
    });
  } catch (error) {
    if (isPrismaNotFoundError(error)) {
      return NextResponse.json({ message: '用户不存在' }, { status: 404 });
    }

    console.error('更新失败:', error);
    return NextResponse.json(
      { error: '更新失败' },
      { status: 500 }
    );
  }
}