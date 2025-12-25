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

export async function POST(request: Request) {
  try {
    const { username, password, isDynamicEmail } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 检查是否存在该用户
    const existingUser = await prisma.adminUser.findFirst({
      where: { username }
    });

    if (existingUser) {
      // 存在则更新密码或 isDynamicEmail 状态
      await prisma.adminUser.update({
        where: { id: existingUser.id },
        data: { password, isDynamicEmail }
      });
      return NextResponse.json({ message: '更新成功' });
    } else {
      // 不存在则创建新记录
      await prisma.adminUser.create({
        data: {
          username,
          password,
          isDynamicEmail: isDynamicEmail || false
        }
      });
      return NextResponse.json({ message: '创建成功' });
    }
  } catch (error) {
    console.error('操作失败:', error);
    return NextResponse.json(
      { error: '操作失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    await prisma.adminUser.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除失败:', error);
    return NextResponse.json(
      { error: '删除失败' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, isDynamicEmail } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    await prisma.adminUser.update({
      where: { id: parseInt(id) },
      data: { isDynamicEmail }
    });

    return NextResponse.json({ message: '更新成功' });
  } catch (error) {
    console.error('更新失败:', error);
    return NextResponse.json(
      { error: '更新失败' },
      { status: 500 }
    );
  }
}