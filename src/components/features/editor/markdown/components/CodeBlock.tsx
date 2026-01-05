import { Check, ChevronRight, Copy } from "lucide-react";
import React, { useCallback, useState } from "react";


  export const CodeBlock = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const [copied, setCopied] = useState(false);

    // 提取语言类型
    const language = React.isValidElement(children)
      ? ((children as React.ReactElement)
        .props as { className?: string })
        .className?.match(/language-([\w-]+)/)?.[1] || 'text'
      : 'text';

    // 处理复制代码
    const handleCopy = useCallback(() => {
      const getTextContent = (node: React.ReactNode): string => {
        if (typeof node === 'string') {
          return node;
        }
        if (Array.isArray(node)) {
          return node.map(getTextContent).join('');
        }

        if (React.isValidElement(node) && node.props) {
          return getTextContent((node.props as React.PropsWithChildren).children);
        }

        return '';
      };

      const codeText = getTextContent(children);

      if (codeText) {
        // 复制代码到剪贴板
        navigator.clipboard.writeText(codeText).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
          console.error('复制失败:', err);
        });
      }
    }, [children]);

    // 语言显示名称映射
    const languageDisplayNames: Record<string, string> = {
      js: 'JavaScript',
      ts: 'TypeScript',
      py: 'Python',
      java: 'Java',
      cpp: 'C++',
      csharp: 'C#',
      go: 'Go',
      rs: 'Rust',
      sql: 'SQL',
      html: 'HTML',
      css: 'CSS',
      json: 'JSON',
      yaml: 'YAML',
      md: 'Markdown',
      text: 'Text'
    };

    const displayLanguage = languageDisplayNames[language] || language.charAt(0).toUpperCase() + language.slice(1);

    return (
      <div className="relative group  my-6 overflow-hidden rounded-lg border border-border">
        <div className={`flex justify-between items-center px-4 py-2 bg-muted/90 dark:bg-muted/90 border-b border-border`}>
          {/* 语言标签 */}
          <div className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className={`text-xs font-medium font-mono capitalize text-muted-foreground`}>
              {displayLanguage}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 
            transition-all duration-200 bg-secondary
             hover:bg-secondary/80 rounded-md px-2.5 
             py-1 text-xs font-medium text-secondary-foreground 
             flex items-center gap-1.5"
            aria-label="复制代码"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>复制</span>
              </>
            )}
          </button>
        </div>
        <div className="hljs">
          <pre className={`overflow-x-auto text-sm leading-relaxed m-0 !bg-transparent ${className || ''}`}>
            {children}
          </pre>
        </div>
      </div>
    );
  };
