export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    imageUrls: string[];
    priceHistory: { date: string; price: number }[];
    reviews: { user: string; rating: number; comment: string; date: string }[];
  }