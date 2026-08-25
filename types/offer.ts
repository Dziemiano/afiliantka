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
  category?: "personal" | "business" | "credit-cards";
  /** Visitor-facing: what to do to get the bonus (public UI). */
  bonusRequirement?: string;
  /** Collaborator onboarding requirement (dashboard/API). */
  requirement?: string;
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
  image?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
}
