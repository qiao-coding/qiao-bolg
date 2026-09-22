import { NextResponse } from 'next/server';

/**
 * 清理 /api/adminLogin 写入的 adminAuth cookie。
 * /src/hooks/admin/api_admin.ts 的 postAdminLogout() 依赖本端点（此前该路由缺失，
 * 调用必然失败）。这里只负责写 cookie，不做 Auth.js 跳转，便于前端拿 JSON 结果。
 */
export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('adminAuth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return res;
}
