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

export interface PortableTextBlock {
  _type: string;
  children?: PortableTextChild[];
  [key: string]: unknown;
}

export interface PortableTextChild {
  _type: string;
  text?: string;
  [key: string]: unknown;
}

export interface HeroContent {
  _id: string;
  title: string;
  description: PortableTextBlock[];
  image: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
}
