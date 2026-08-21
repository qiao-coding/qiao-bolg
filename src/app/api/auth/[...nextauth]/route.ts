import { handlers } from "../../../../../auth"
export const { GET, POST } = handlers
// 不要设置 runtime = "edge"：@auth/core 的 OAuth callback 在 Edge Runtime 下
// 解析/写入 cookie 会抛 [TypeError: immutable]，导致 GitHub 登录 500。
// 使用默认 Node.js runtime（也兼容 serverExternalPackages 里的 @prisma/client）。