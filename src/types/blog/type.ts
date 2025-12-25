interface HomeIcon {
  id: number;
  name: string;
  link: string;
}

interface SocialLink {
  id: number;
  name: string;
  link: string;
}

interface BlogData {
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
}



export type { HomeIcon, SocialLink, BlogData };
