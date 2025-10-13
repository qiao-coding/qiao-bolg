import { NextResponse } from 'next/server';
import { signOut } from '../../../../../auth';

export async function POST(request: Request) {
  try {
    await signOut({ redirectTo: '/' });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('服务器端登出失败:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}