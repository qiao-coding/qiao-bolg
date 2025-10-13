import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface UserResponse {
  id: string;
  username: string;
  createdAt: string;
  lastActivity: string;
}

export async function GET() {
  try {
    const users = await prisma.adminUser.findMany();
    
    const formattedUsers: UserResponse[] = users.map(user => ({
      id: user.id.toString(),
      username: user.username,
      createdAt: user.createdAt.toISOString(),
      lastActivity: '未知'
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