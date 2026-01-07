
import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/layout/ClientProviders";
import { SessionProvider } from "next-auth/react";
import { prisma } from "@/lib/prisma";
import { BlogDataProvider } from "@/components/layout/BlogDataProvider";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const blogSetting = await prisma.blogSetting.findUnique({
      where: { id: 1 }
    });

    return {
      title: blogSetting?.blogName || "haowhite",
      icons: '/user_img/up.jpg',
    };
  } catch (error) {
    console.error("获取博客设置失败:", error);
    return {
      title: "haowhite",
      icons: '/user_img/up.jpg',
    };
  }
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
    >
      <body
        className={` antialiased bg-image-[url('/bg.webp')]`}
        suppressHydrationWarning
      >
        <SessionProvider>
          <BlogDataProvider>
            <ClientProviders>
        
              {children}
            </ClientProviders>
          </BlogDataProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
