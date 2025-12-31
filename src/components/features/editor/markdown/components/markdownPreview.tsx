import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownPreviewProps {
  content: string;
  theme: 'light' | 'dark';
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, theme }) => {
  return (
    <div className={`h-full overflow-auto p-6 prose prose-lg max-w-none ${theme === 'dark'
      ? 'prose-invert bg-gray-900'
      : 'bg-white'
      }`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ children }) => (
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4">
              {children}
            </pre>
          ),
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code
                className={`${className} bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono`}
                {...props}
              >
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
