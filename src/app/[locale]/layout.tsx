import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SessionProvider } from "next-auth/react";
import { prisma } from "@/lib/prisma";
import { ClientProviders } from "@/components/layout/ClientProviders";
import { BlogDataProvider } from "@/components/layout/BlogDataProvider";
import { LocaleProvider, type Locale } from '@/i18n/LocaleContext';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  try {
    const blogSetting = await prisma.blogSetting.findUnique({
      where: { id: 1 }
    });

    return {
      title: blogSetting?.blogName || "haowhite",
      icons: '/user_img/up.jpg',
      alternates: {
        languages: {
          'zh': '/zh',
          'en': '/en',
        },
      },
    };
  } catch (error) {
    console.error("Failed to get blog settings:", error);
    return {
      title: "haowhite",
      icons: '/user_img/up.jpg',
      alternates: {
        languages: {
          'zh': '/zh',
          'en': '/en',
        },
      },
    };
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <LocaleProvider locale={locale as Locale}>
        <SessionProvider>
          <BlogDataProvider>
            <ClientProviders>
              {children}
            </ClientProviders>
          </BlogDataProvider>
        </SessionProvider>
      </LocaleProvider>
    </NextIntlClientProvider>
  );
}
