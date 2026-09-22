import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  // 登录失败时跳自有错误页（带 ?error=<Code>）。不配这项时 Auth.js 会用它内置的
  // 错误页并以 HTTP 500 渲染，用户只看到「server error」；同时 server action 里的
  // signIn() 拿不到 redirect，会兜底跳到 /api/auth/signin/<provider>——该地址只接受
  // POST，GET 必然抛 UnknownAction，最终仍然是 500。
  pages: { error: "/auth-error" },
  // AUTH_DEBUG=1 时输出 Auth.js 详细日志，便于线上排查（默认关闭）。
  debug: process.env.AUTH_DEBUG === "1",
  providers: [GitHub],
})
