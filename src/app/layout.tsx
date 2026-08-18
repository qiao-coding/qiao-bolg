import './globals.css';
import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className="antialiased bg-image-[url('/bg.webp')]"
        suppressHydrationWarning
      >
        {/* 路由跳转顶部加载进度条（anime 蓝） */}
        <NextTopLoader
          color="#38bdf8"
          height={3}
          showSpinner={false}
          crawl
          speed={400}
        />
        {children}
      </body>
    </html>
  );
}
