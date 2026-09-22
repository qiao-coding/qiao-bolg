import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { signOut } from '../../../../../auth';

/**
 * 服务端登出。signOut() 是通过抛出 NEXT_REDIRECT 来完成跳转的，
 * 之前 catch 把它当成失败吞掉，导致本接口恒定返回 500。
 */
function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest?: unknown }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  );
}

export async function POST() {
  // 顺带清掉 /api/adminLogin 写入的旧 cookie，避免登出后残留。
  const cookieStore = await cookies();
  cookieStore.delete('adminAuth');

  try {
    await signOut({ redirectTo: '/' });
  } catch (error) {
    // 正常跳转必须原样抛给 Next.js 处理。
    if (isNextRedirect(error)) throw error;
    console.error('服务器端登出失败:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  // signOut 正常路径一定会抛 NEXT_REDIRECT，走不到这里，仅作保底。
  return NextResponse.json({ success: true });
}
