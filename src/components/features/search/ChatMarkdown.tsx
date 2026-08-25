"use client";

import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useTheme } from "next-themes";
import type { Components } from "react-markdown";
import { MarkdownStyle } from "@/components/features/editor/markdown/utils";

/**
 * 聊天气泡内的 markdown 渲染。
 * 复用项目已有方案：react-markdown + remark-gfm + rehype-highlight，
 * 高亮主题由 MarkdownStyle 按 next-themes 切换（同笔记正文/编辑器），
 * 不自己手写解析器。代码块背景/前景交给气泡容器控制，token 颜色由主题提供。
 */
export function ChatMarkdown({ content }: { content: string }) {
  const { theme, resolvedTheme } = useTheme();
  const isDark = (resolvedTheme ?? theme) === "dark";

  // 加载对应明暗主题的 highlight.js 样式（github.css / github-dark.css）
  useEffect(() => {
    MarkdownStyle.getMarkdownStyle({ theme: isDark ? "dark" : "light" });
  }, [isDark]);

  return (
    <div className="chat-md text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

const components: Components = {
  p: ({ children }) => <p className="my-1.5">{children}</p>,
  h1: ({ children }) => (
    <h1 className="mb-1 mt-2.5 text-base font-semibold">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-1 mt-2.5 text-base font-semibold">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-1 mt-2 text-sm font-semibold">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-1 mt-2 text-sm font-semibold">{children}</h4>
  ),
  ul: ({ children }) => <ul className="my-1.5 list-disc pl-5">{children}</ul>,
  ol: ({ children }) => (
    <ol className="my-1.5 list-decimal pl-5">{children}</ol>
  ),
  li: ({ children }) => <li className="my-0.5 leading-relaxed">{children}</li>,
  a: ({ children, ...props }) => (
    <a
      className="text-brand-blue-deep underline decoration-dashed underline-offset-2 hover:text-brand-pink dark:text-[#9ec7f5]"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-brand-blue pl-2.5 text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-border/60" />,
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-lg bg-muted/40 p-3 text-xs leading-relaxed dark:bg-black/25">
      {children}
    </pre>
  ),
  // rehype-highlight 处理后块级 code 带 hljs / language-* 类；行内 code 没有。
  // 多行（fenced）无语言块也按块级处理，避免被误当行内 chip。
  code({ className, children, node, ...props }) {
    const isBlock =
      className?.includes("hljs") ||
      /language-\w+/.test(className ?? "") ||
      (node?.position?.start.line ?? 0) !== (node?.position?.end.line ?? 0);
    return isBlock ? (
      <code className={className} {...props}>
        {children}
      </code>
    ) : (
      <code
        className="rounded-md bg-muted/70 px-1.5 py-0.5 font-mono text-[0.85em]"
        {...props}
      >
        {children}
      </code>
    );
  },
};
