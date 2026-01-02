import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password, isDynamicEmail } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 对密码进行哈希加密
    const hashedPassword = await bcrypt.hash(password, 12);

    // 检查是否存在该用户
    const existingUser = await prisma.adminUser.findFirst({
      where: { username }
    });

    if (existingUser) {
      // 存在则更新密码或 isDynamicEmail 状态
      await prisma.adminUser.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword, isDynamicEmail }
      });
      return NextResponse.json({ message: '更新成功' });
    } else {
      // 不存在则创建新记录
      await prisma.adminUser.create({
        data: {
          username,
          password: hashedPassword,
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