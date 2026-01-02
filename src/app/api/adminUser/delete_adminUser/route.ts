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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawId = searchParams.get('id');

    const id = parseId(rawId);

    if (id === null) {
      return NextResponse.json(
        { error: '用户ID不能为空或格式不正确' },
        { status: 400 }
      );
    }

    await prisma.adminUser.delete({
      where: { id }
    });

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    if (isPrismaNotFoundError(error)) {
      return NextResponse.json({ message: '记录不存在或已删除' }, { status: 200 });
    }

    console.error('删除失败:', error);
    return NextResponse.json(
      { error: '删除失败' },
      { status: 500 }
    );
  }
}