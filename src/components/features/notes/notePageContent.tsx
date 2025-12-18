'use client'
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Check, Copy } from 'lucide-react';
import 'highlight.js/styles/github.css';

export function NotePageContent({ content }: { content: string }) {
  const CodeBlock = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const [copied, setCopied] = useState(false);


    // 提取语言类型
    const language = React.isValidElement(children)
      ? ((children as React.ReactElement)
        .props as { className?: string })
        .className?.match(/language-(\w+)/)?.[1]
      : 'text';


    // 处理复制代码
    const handleCopy = () => {
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
    };



    return (
      <div className="relative group">
        <div className={`flex justify-between bg-muted items-center
           px-4 py-2 rounded-t-lg 
           bg-muted dark:bg-muted
           border border-border border-b-0`}>

          {/* 语言标签,如果后续添加图标，这里可以添加图标，使用language去判断 */}
          <span className={`
            text-xs font-medium
            text-black dark:text-white
             capitalize text-muted-foreground`}>
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-secondary/80 hover:bg-secondary rounded-md px-2 py-1 text-xs font-medium text-secondary-foreground flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                已复制
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                复制
              </>
            )}
          </button>
        </div>
        <div className={`
        rounded-b-lg
           bg-muted dark:bg-muted/70
            border border-border overflow-hidden my-0`}>
          {/* 代码内容 */}
          <pre className={`p-5 m-0 !bg-transparent hljs ${className || ''}`}>
            {children}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="text-foreground mb-12">
      <div className="prose min-h-[50vh] prose-slate max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw, rehypeSanitize]}
          components={{
            p: ({ className, ...props }) => <p className={`my-4 leading-relaxed ${className || ''}`} {...props} />,
            h1: ({ className, ...props }) => <h1 className={`text-3xl font-bold mt-8 mb-4 ${className || ''}`} {...props} />,
            h2: ({ className, ...props }) => <h2 className={`text-2xl font-bold mt-8 mb-3 ${className || ''}`} {...props} />,
            h3: ({ className, ...props }) => <h3 className={`text-xl font-bold mt-6 mb-2 ${className || ''}`} {...props} />,
            code: ({ className, ...props }) => {
              const isInlineCode = !className?.includes('language');

              return (
                <code
                  className={` text-muted-foreground font-mono  ${isInlineCode
                    ? 'px-1 py-0.5 rounded text-sm '
                    : className}`
                  }
                  {...props}
                />
              );
            },
            pre: ({ className, ...props }) => {
              const children = props.children;
              return <CodeBlock className={className}>{children}</CodeBlock>;
            },
            a: ({ ...props }) => <a
              className="text-[#4A6FA5] hover:text-[#3A5F95] underline dark:text-blue-400 dark:hover:text-blue-300"
              {...props} />
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}