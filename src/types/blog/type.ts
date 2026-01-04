export type HomeIcon = {
  id: number;
  name: string;
  link: string;
};

export type SocialLink = {
  id: number;
  name: string;
  link: string;
};

export type BlogData = {
  blogName: string;
  homePage: {
    mainTitle: string;
    subTitle: string;
    isDynamicTitle: boolean;
    isDynamicTiltCard: boolean;
  };
  homeIcons: HomeIcon[];
  notesSidebar: {
    name: string;
    email: string;
    socialLinks: SocialLink[];
    isDynamicEmail: boolean;
    isDynamicName: boolean;
  };
};

export type BlogDataStruct = {
  blogName?: string;
  homePage: {
    mainTitle: string;
    subTitle: string;
    isDynamicTitle: boolean;
    isDynamicTiltCard: boolean;
  };
  homeIcons: Array<{
    name: string;
    link: string;
  }>;
};
