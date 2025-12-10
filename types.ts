export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  category: string;
  imageURL: string;
  stock: number;
  tags: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
}

export interface Order {
  _id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'completed';
}

export type ViewState = 'HOME' | 'SHOP' | 'PRODUCT_DETAILS' | 'CART' | 'CHECKOUT' | 'LOGIN' | 'REGISTER' | 'PROFILE';

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  search: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isProductRecommendation?: boolean;
  recommendedProductIds?: string[];
}