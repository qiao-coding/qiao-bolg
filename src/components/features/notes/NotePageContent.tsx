'use client'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import 'highlight.js/styles/github.css';

export function NotePageContent({ content }: { content: string }) {
  return (
    <div className="text-[#4A5568] dark:text-gray-300 mb-12">
      <div className="prose min-h-[50vh] prose-slate max-w-none dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw, rehypeSanitize]}
          components={{
            p: ({ className, ...props }) => <p className={`my-4 leading-relaxed ${className || ''}`} {...props} />,
            h1: ({ className, ...props }) => <h1 className={`text-3xl font-bold mt-8 mb-4 ${className || ''}`} {...props} />,
            h2: ({ className, ...props }) => <h2 className={`text-2xl font-bold mt-8 mb-3 ${className || ''}`} {...props} />,
            h3: ({ className, ...props }) => <h3 className={`text-xl font-bold mt-6 mb-2 ${className || ''}`} {...props} />,
            code: ({ className, ...props }) => <code className={`font-mono text-sm text-[#6B7A90] dark:text-gray-400 ${className || ''}`} {...props} />,
            pre: ({ className, ...props }) => <pre className={`p-4 rounded-lg bg-black/10  overflow-x-auto my-4 ${className || ''}`} {...props} />,
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

