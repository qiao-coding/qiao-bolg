'use client'
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/shadcnComponents/data-display/card";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github.css';
import { useSession } from 'next-auth/react';
import { Miscellaneous } from '@/types/miscellaneous/type';

// 创建单独的TimelineItem组件以支持独立的动画延迟
function TimelineItem({ item }: { item: Miscellaneous }) {
  const { data: session } = useSession()

  return (
    <div className="mb-5">
      <Card className="overflow-hidden h-full border
       border-border/70 shadow-sm
       bg-card/85 rounded-lg"
      >
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="relative w-10 h-10 rounded-md overflow-hidden ring-1 ring-border">
                <Image
                  src={session?.user?.image || "/user_img/up.jpg"}
                  alt="User Image"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-foreground leading-relaxed text-base md:text-lg mb-3">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    p: ({ className, ...props }) => <p className={`my-4 leading-relaxed ${className || ''}`} {...props} />,
                    h1: ({ className, ...props }) => <h1 className={`text-3xl font-bold mt-8 mb-4 ${className || ''}`} {...props} />,
                    h2: ({ className, ...props }) => <h2 className={`text-2xl font-bold mt-8 mb-3 ${className || ''}`} {...props} />,
                    h3: ({ className, ...props }) => <h3 className={`text-xl font-bold mt-6 mb-2 ${className || ''}`} {...props} />,
                    code: ({ className, ...props }) => {
                      return <code className={className} {...props} />;
                    },
                    pre: ({ className, ...props }) => {
                      return (
                        <pre className={`${className} overflow-x-auto p-4 rounded-lg mb-4`} {...props} />
                      );
                    },
                    a: ({ ...props }) => <a
                      className="text-brand-blue-deep hover:text-brand-pink-deep underline"
                      {...props} />
                  }}
                >
                  {item.content}
                </ReactMarkdown>
              </div>
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm font-medium text-muted-foreground">
                  记录于 {item.date}
                </p>
                <div className="flex items-center">
                  <span className="rounded-md bg-brand-pink-soft px-2 py-1 text-xs text-brand-pink-deep transition-colors duration-300">#{item.id}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function MiscellaneousTimeline({
  items,
}: {
  items: Miscellaneous[];
}) {
  return (
    <section >
      <div className="max-w-4xl mx-4   lg:mx-0 lg:mx-[calc(50%-18rem)] lg:max-w-3xl">
        {items.map((item) => (
          <TimelineItem key={item.id} item={item} />
        ))}
      </div>


    </section>
  );
}
