export interface Offer {
  _id: string;
  title: string;
  description: string;
  image: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  link: string;
  files?: Array<{
    asset: {
      _ref: string;
      _type: string;
      url?: string;
    };
    _key: string;
  }>;
}
