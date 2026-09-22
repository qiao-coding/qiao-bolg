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
  providers: [
    GitHub({
      // GitHub 已按 RFC 9207 在 OAuth 回调 URL 上强制携带 iss=https://github.com/login/oauth。
      // 本版 @auth/core 的 GitHub provider 没有声明 issuer，Auth.js 会退回占位符
      // "https://authjs.dev" 去比对，必然不匹配 → CallbackRouteError → 被掩盖成
      // error=Configuration 并以 HTTP 500 呈现（前端只看到「server error」）。
      // 这里显式对齐 GitHub 的 iss 值；必须带 /login/oauth 路径，不能只写 https://github.com。
      issuer: "https://github.com/login/oauth",
    }),
  ],
})
