import { Link } from "@/i18n/navigation";
import { RotatingCube } from "@/components/features/mol/RotatingCube";
import { en, zh } from "@/i18n/dictionaries";

/**
 * Auth.js 登录失败落点页。
 * auth.ts 里配置了 `pages: { error: "/auth-error" }`，Auth.js 会把错误码
 * 以 ?error=<Code> 原样带过来；这里把机器码翻成可读原因，避免用户只看到
 * Auth.js 内置的 HTTP 500「Configuration」错误页。
 */
export default async function AuthErrorPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;

  const dict = locale === "en" ? en : zh;
  const codes = dict.authError.codes as Record<string, string>;
  const reason = (error && codes[error]) || dict.authError.desc;

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-paper px-4 text-foreground">
      <div className="flex flex-col items-center justify-center text-center">
        <RotatingCube />
        <p className="mt-6 text-3xl font-bold text-brand-blue-deep dark:text-[#dbe9f8]">
          {dict.authError.title}
        </p>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          {reason}
        </p>
        {error ? (
          <p className="mt-2 text-xs text-muted-foreground/80">
            {dict.authError.reasonLabel}：
            <code className="rounded bg-muted px-1 py-0.5 font-mono">{error}</code>
          </p>
        ) : null}
        <div className="mt-7 flex items-center gap-5">
          <Link
            href="/Login"
            className="text-brand-blue-deep font-bold hover:text-brand-pink-deep dark:text-[#dbe9f8] dark:hover:text-[#ffddec]"
          >
            {dict.authError.retry}
          </Link>
          <Link
            href="/"
            className="text-brand-blue-deep font-bold hover:text-brand-pink-deep dark:text-[#dbe9f8] dark:hover:text-[#ffddec]"
          >
            {dict.common.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
