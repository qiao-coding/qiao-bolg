import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SessionProvider } from "next-auth/react";
import { prisma } from "@/lib/prisma";
import { ClientProviders } from "@/components/layout/ClientProviders";
import { BlogDataProvider } from "@/components/layout/BlogDataProvider";
import { LocaleProvider, type Locale } from '@/i18n/LocaleContext';
import type { BlogData } from '@/types/blog/type';

async function getInitialBlogData(locale: string): Promise<BlogData | null> {
  const defaults = {
    zh: {
      blogName: "HaoWhiteの小站",
      mainTitle: "HaoWhite Blog",
      subTitle: "把日常学习、代码记录和一点点生活感，安静地收在这里。",
    },
    en: {
      blogName: "HaoWhite's Blog",
      mainTitle: "HaoWhite Blog",
      subTitle: "Personal notes, code records, and small moments of life.",
    },
  };
  const defaultData = defaults[locale as keyof typeof defaults] || defaults.zh;

  try {
    const blogSetting = await prisma.blogSetting.findUnique({
      where: { id: 1 },
      include: {
        homePage: true,
        homeIcons: {
          orderBy: { order: 'asc' },
        },
        notesSidebar: {
          include: {
            socialLinks: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!blogSetting) {
      return {
        blogName: defaultData.blogName,
        homePage: {
          mainTitle: defaultData.mainTitle,
          subTitle: defaultData.subTitle,
          isDynamicTitle: false,
          isDynamicTiltCard: true,
        },
        homeIcons: [],
        notesSidebar: {
          name: "昊小白",
          email: "",
          socialLinks: [],
          isDynamicEmail: true,
          isDynamicName: false,
        },
      };
    }

    return {
      blogName: blogSetting.blogName || defaultData.blogName,
      homePage: blogSetting.homePage ? {
        mainTitle: blogSetting.homePage.mainTitle || defaultData.mainTitle,
        subTitle: blogSetting.homePage.subTitle || defaultData.subTitle,
        isDynamicTitle: blogSetting.homePage.isDynamicTitle,
        isDynamicTiltCard: blogSetting.homePage.isDynamicTiltCard,
      } : {
        mainTitle: defaultData.mainTitle,
        subTitle: defaultData.subTitle,
        isDynamicTitle: false,
        isDynamicTiltCard: true,
      },
      homeIcons: blogSetting.homeIcons.map((icon) => ({
        id: icon.id,
        name: icon.name,
        link: icon.link,
      })),
      notesSidebar: blogSetting.notesSidebar ? {
        name: blogSetting.notesSidebar.name,
        email: blogSetting.notesSidebar.email,
        isDynamicEmail: blogSetting.notesSidebar.isDynamicEmail,
        isDynamicName: blogSetting.notesSidebar.isDynamicName,
        socialLinks: blogSetting.notesSidebar.socialLinks.map((socialLink) => ({
          id: socialLink.id,
          name: socialLink.name,
          link: socialLink.link,
        })),
      } : {
        name: "昊小白",
        email: "",
        socialLinks: [],
        isDynamicEmail: true,
        isDynamicName: false,
      },
    };
  } catch (error) {
    console.error("Failed to get initial blog data:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  await params;

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
  const initialBlogData = await getInitialBlogData(locale);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <LocaleProvider locale={locale as Locale}>
        <SessionProvider>
          <BlogDataProvider initialData={initialBlogData}>
            <ClientProviders>
              {children}
            </ClientProviders>
          </BlogDataProvider>
        </SessionProvider>
      </LocaleProvider>
    </NextIntlClientProvider>
  );
}
