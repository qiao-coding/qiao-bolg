import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminUser } from '@/types/user/type';

export async function GET() {
  try {
    const users = await prisma.adminUser.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const formattedUsers: adminUser[] = users.map(user => ({
      id: user.id.toString(),
      username: user.username,
      createdAt: user.createdAt.toISOString(),
      lastActivity: '未知',
      isDynamicEmail: user.isDynamicEmail
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('获取管理员用户数据失败:', error);
    return NextResponse.json(
      { error: '获取管理员用户数据失败' },
      { status: 500 }
    );
  }
}