export interface Offer {
  _id: string;
  title: string;
  description?: any[];
  image: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  link: string;
  featured: boolean;
  files?: Array<{
    asset: {
      _ref: string;
      _type: string;
      url: string;
      originalFilename?: string;
    };
    _key: string;
  }>;
  slug: {
    current: string;
  };
}

export interface HeroContent {
  _id: string;
  title: string;
  description: any[];
  image: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
}
