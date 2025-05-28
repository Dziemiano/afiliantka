export interface Offer {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: any; // Sanity image reference
  link: string;
  createdAt: Date;
  updatedAt: Date;
}
