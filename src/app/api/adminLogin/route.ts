import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    const adminUser = await prisma.adminUser.findUnique({
      where: { username },
    });
    
    if (!adminUser || !(await bcrypt.compare(password, adminUser.password))) {
      return NextResponse.json({ success: false, error: '用户名或密码错误' }, { status: 401 });
    }
    
    const response = NextResponse.json({ success: true, message: '登录成功' });
    
    response.cookies.set('adminAuth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      path: '/', 
    });
    
    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ success: false, error: '登录失败' }, { status: 500 });
  }
}

