import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const authOptions = {
  // 身份验证方法配置
  providers: [GitHub],
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)