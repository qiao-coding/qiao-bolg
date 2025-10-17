import GitHub from "next-auth/providers/github";
import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  ],

  // 使用默认会话策略
  session: {
    strategy: "jwt",
  },
  
  // 简化页面配置
  pages: {
    signIn: '/',
    error: '/Login',
  },
  
  // 确保使用正确的密钥
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  
  // 禁用调试模式，避免过多日志
  debug: false,

  callbacks: {
    // 仅保留必要的回调函数
    jwt({ token, user }) {
      // 只在登录时添加用户ID
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    
    // 简单的session回调
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    
    // 移除复杂的redirect逻辑，使用更简单的实现
    redirect({ url, baseUrl }) {
      // 非常简单的实现：如果URL以基础URL开头或相对路径，则允许
      if (url.startsWith(baseUrl) || url.startsWith('/')) {
        return url;
      }
      return baseUrl;
    },
  }
});