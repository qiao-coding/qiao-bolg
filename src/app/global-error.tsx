"use client";

import { useEffect, useState } from "react";
import { en, zh } from "@/i18n/dictionaries";

/**
 * 全局错误边界。它会替换根布局渲染，因此全局样式（globals.css）不保证可用，
 * 这里统一用内联样式；同时它不在 LocaleProvider 内，语言从 URL 前缀推断。
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [locale, setLocale] = useState<"zh" | "en">("zh");

  useEffect(() => {
    if (window.location.pathname.startsWith("/en")) setLocale("en");
    console.error("全局渲染失败:", error);
  }, [error]);

  const dict = (locale === "en" ? en : zh).errorPage;

  return (
    <html lang={locale}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fdf7f8",
          color: "#1f2937",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{dict.title}</p>
          <p style={{ fontSize: 14, lineHeight: 1.7, marginTop: 12, color: "#4b5563" }}>
            {dict.desc}
          </p>
          {error.digest ? (
            <p style={{ fontSize: 12, marginTop: 8, color: "#6b7280" }}>
              {dict.digest}: <code>{error.digest}</code>
            </p>
          ) : null}
          <div style={{ marginTop: 28, display: "flex", gap: 20, justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1d4ed8",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {dict.retry}
            </button>
            <button
              type="button"
              // 全局边界已经破坏了整棵渲染树，这里用整页跳转而不是客户端路由。
              onClick={() => window.location.assign("/")}
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1d4ed8",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {dict.home}
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
