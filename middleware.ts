import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth) {
    // 未认证的请求，只允许访问公开页面
    const publicPaths = [
      '/',
      '/Login',
      '/notes',
      '/friend',
      '/miscellaneous',
      '/about',
      '/api/auth/callback/github',
      '/api/auth/session',        
      '/api/auth/signin',         
    ];
    
    const isPublicPath = publicPaths.some(path => 
      req.nextUrl.pathname === path || 
      req.nextUrl.pathname.startsWith(`${path}/`)
    );
    
    // 如果不是公开页面，重定向到登录页
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/Login', req.url));
    }
  }
  
  return NextResponse.next();
});

// 配置中间件的匹配路径
// 注意：不要过滤掉认证相关的API路由
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};