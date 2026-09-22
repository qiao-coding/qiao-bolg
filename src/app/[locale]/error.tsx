"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { RotatingCube } from "@/components/features/mol/RotatingCube";
import { useT } from "@/i18n/LocaleContext";

/**
 * [locale] 段的错误边界：页面渲染抛异常时兜住，给用户可读提示 + 重试入口，
 * 而不是 Next.js 默认的 "Application error: a server-side exception has occurred"。
 * 注意：这里捕获不到 [locale]/layout.tsx 自身的异常，那种情况由 global-error 兜底。
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();

  useEffect(() => {
    console.error("页面渲染失败:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-paper px-4 text-foreground">
      <div className="flex flex-col items-center justify-center text-center">
        <RotatingCube />
        <p className="mt-6 text-3xl font-bold text-brand-blue-deep dark:text-[#dbe9f8]">
          {t("errorPage.title")}
        </p>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          {t("errorPage.desc")}
        </p>
        {error.digest ? (
          <p className="mt-2 text-xs text-muted-foreground/80">
            {t("errorPage.digest")}：
            <code className="rounded bg-muted px-1 py-0.5 font-mono">{error.digest}</code>
          </p>
        ) : null}
        <div className="mt-7 flex items-center gap-5">
          <button
            type="button"
            onClick={() => reset()}
            className="cursor-pointer text-brand-blue-deep font-bold hover:text-brand-pink-deep dark:text-[#dbe9f8] dark:hover:text-[#ffddec]"
          >
            {t("errorPage.retry")}
          </button>
          <Link
            href="/"
            className="text-brand-blue-deep font-bold hover:text-brand-pink-deep dark:text-[#dbe9f8] dark:hover:text-[#ffddec]"
          >
            {t("errorPage.home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
