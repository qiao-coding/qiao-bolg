import { Github } from "lucide-react"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  // 身份验证方法配置，这里是使用Github作为身份验证方法
  providers: [GitHub],
})