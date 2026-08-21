import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// 默认使用 ID 为 1 的记录
const BLOG_ID = 1;

type BlogSettingFull = Prisma.BlogSettingGetPayload<{
  include: {
    homePage: true;
    homeIcons: true;
    notesSidebar: { include: { contacts: true; socialLinks: true } };
  };
}>;

export type BlogSettingsShape = {
  blogName: string | null;
  homePage: {
    mainTitle: string;
    subTitle: string;
    isDynamicTitle: boolean;
    isDynamicTiltCard: boolean;
  } | null;
  homeIcons: { id: number; name: string; link: string }[];
  notesSidebar: {
    name: string | null;
    email: string | null;
    isDynamicEmail: boolean;
    isDynamicName: boolean;
    socialLinks: { id: number; name: string; link: string }[];
  } | null;
};

export type BlogSettingsInput = {
  blogName?: string;
  homePage?: {
    mainTitle?: string;
    subTitle?: string;
    isDynamicTitle?: boolean;
    isDynamicTiltCard?: boolean;
  };
  homeIcons?: { name: string; link: string }[];
  notesSidebar?: {
    name?: string;
    email?: string;
    isDynamicEmail?: boolean;
    isDynamicName?: boolean;
    socialLinks?: { name: string; link: string }[];
  };
};

/** Fetch raw blog settings (no locale defaulting) or null when absent. */
export async function getBlogSettings(): Promise<BlogSettingsShape | null> {
  const blogSetting = await prisma.blogSetting.findUnique({
    where: { id: BLOG_ID },
    include: {
      homePage: true,
      homeIcons: { orderBy: { order: "asc" } },
      notesSidebar: {
        include: { socialLinks: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!blogSetting) return null;

  return serialize(blogSetting);
}

/** Update-or-create the blog settings record, preserving nested relations. */
export async function upsertBlogSettings(input: BlogSettingsInput): Promise<BlogSettingsShape> {
  const { blogName, homePage, homeIcons, notesSidebar } = input;

  const existing = await prisma.blogSetting.findUnique({
    where: { id: BLOG_ID },
    include: {
      homePage: true,
      notesSidebar: { include: { contacts: true, socialLinks: true } },
    },
  });

  let updated: BlogSettingFull;

  if (existing) {
    const updateData: Prisma.BlogSettingUpdateInput = {
      ...(blogName !== undefined ? { blogName } : {}),
      ...(homeIcons
        ? {
            homeIcons: {
              deleteMany: {},
              create: homeIcons.map((icon, index) => ({
                name: icon.name,
                link: icon.link,
                order: index,
              })),
            },
          }
        : {}),
    };

    if (homePage) {
      updateData.homePage = existing.homePage
        ? { update: buildHomePageUpdate(homePage) }
        : { create: buildHomePageCreate(homePage) };
    }

    if (notesSidebar) {
      updateData.notesSidebar = existing.notesSidebar
        ? { update: buildSidebarUpdate(notesSidebar) }
        : { create: buildSidebarCreate(notesSidebar) };
    }

    updated = await prisma.blogSetting.update({
      where: { id: BLOG_ID },
      data: updateData,
      include: {
        homePage: true,
        homeIcons: true,
        notesSidebar: { include: { contacts: true, socialLinks: true } },
      },
    });
  } else {
    updated = await prisma.blogSetting.create({
      data: {
        id: BLOG_ID,
        blogName: blogName ?? "小小乔の小站",
        ...(homePage ? { homePage: { create: buildHomePageCreate(homePage) } } : {}),
        ...(homeIcons
          ? {
              homeIcons: {
                create: homeIcons.map((icon, index) => ({
                  name: icon.name,
                  link: icon.link,
                  order: index,
                })),
              },
            }
          : {}),
        ...(notesSidebar ? { notesSidebar: { create: buildSidebarCreate(notesSidebar) } } : {}),
      },
      include: {
        homePage: true,
        homeIcons: true,
        notesSidebar: { include: { contacts: true, socialLinks: true } },
      },
    });
  }

  return serialize(updated);
}

// ---------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------

function buildHomePageUpdate(hp: NonNullable<BlogSettingsInput["homePage"]>) {
  return {
    ...(hp.mainTitle !== undefined ? { mainTitle: hp.mainTitle } : {}),
    ...(hp.subTitle !== undefined ? { subTitle: hp.subTitle } : {}),
    isDynamicTitle: hp.isDynamicTitle !== undefined ? hp.isDynamicTitle : true,
    isDynamicTiltCard: hp.isDynamicTiltCard !== undefined ? hp.isDynamicTiltCard : true,
  };
}

function buildHomePageCreate(hp: NonNullable<BlogSettingsInput["homePage"]>) {
  return {
    mainTitle: hp.mainTitle ?? "",
    subTitle: hp.subTitle ?? "",
    isDynamicTitle: hp.isDynamicTitle !== undefined ? hp.isDynamicTitle : true,
    isDynamicTiltCard: hp.isDynamicTiltCard !== undefined ? hp.isDynamicTiltCard : true,
  };
}

function buildSidebarUpdate(sb: NonNullable<BlogSettingsInput["notesSidebar"]>) {
  return {
    ...(sb.name !== undefined ? { name: sb.name } : {}),
    ...(sb.email !== undefined ? { email: sb.email } : {}),
    isDynamicEmail: sb.isDynamicEmail !== undefined ? sb.isDynamicEmail : true,
    isDynamicName: sb.isDynamicName !== undefined ? sb.isDynamicName : true,
    ...(sb.socialLinks
      ? {
          socialLinks: {
            deleteMany: {},
            create: sb.socialLinks.map((sl, index) => ({
              name: sl.name,
              link: sl.link,
              order: index,
            })),
          },
        }
      : {}),
  };
}

function buildSidebarCreate(sb: NonNullable<BlogSettingsInput["notesSidebar"]>) {
  return {
    name: sb.name ?? "",
    email: sb.email ?? "",
    isDynamicEmail: sb.isDynamicEmail !== undefined ? sb.isDynamicEmail : true,
    isDynamicName: sb.isDynamicName !== undefined ? sb.isDynamicName : true,
    ...(sb.socialLinks
      ? {
          socialLinks: {
            create: sb.socialLinks.map((sl, index) => ({
              name: sl.name,
              link: sl.link,
              order: index,
            })),
          },
        }
      : {}),
  };
}

function serialize(updated: {
  blogName: string | null;
  homePage: {
    mainTitle: string;
    subTitle: string;
    isDynamicTitle: boolean;
    isDynamicTiltCard: boolean;
  } | null;
  homeIcons: { id: number; name: string; link: string }[];
  notesSidebar: {
    name: string | null;
    email: string | null;
    isDynamicEmail: boolean;
    isDynamicName: boolean;
    socialLinks: { id: number; name: string; link: string }[];
  } | null;
}): BlogSettingsShape {
  return {
    blogName: updated.blogName,
    homePage: updated.homePage
      ? {
          mainTitle: updated.homePage.mainTitle,
          subTitle: updated.homePage.subTitle,
          isDynamicTitle: updated.homePage.isDynamicTitle,
          isDynamicTiltCard: updated.homePage.isDynamicTiltCard,
        }
      : null,
    homeIcons: updated.homeIcons.map((icon) => ({
      id: icon.id,
      name: icon.name,
      link: icon.link,
    })),
    notesSidebar: updated.notesSidebar
      ? {
          name: updated.notesSidebar.name,
          email: updated.notesSidebar.email,
          isDynamicEmail: updated.notesSidebar.isDynamicEmail,
          isDynamicName: updated.notesSidebar.isDynamicName,
          socialLinks: updated.notesSidebar.socialLinks.map((sl) => ({
            id: sl.id,
            name: sl.name,
            link: sl.link,
          })),
        }
      : null,
  };
}
