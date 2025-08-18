// Common types used throughout the application

export interface FilterOptions {
  category?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  featured?: boolean;
  inStock?: boolean;
  sort?: string;
  page: number;
  limit?: number;
  search?: string;
}

export interface Pagination {
  page: number;
  pages: number;
  total: number;
  limit?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ReviewForm {
  rating: number;
  comment: string;
  customerName: string;
  customerEmail: string;
}

export interface Product {
  _id: string;
  nameEn: string;
  nameFr?: string;
  descriptionEn: string;
  descriptionFr?: string;
  price: number;
  category: string;
  images: string[];
  thumbnailImage?: string;
  videoUrl?: string;
  featured: boolean;
  inStock: boolean;
  stockQuantity?: number;
  sku?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  averageRating?: number;
  reviewCount?: number;
  isActive: boolean;
  condition?: 'new' | 'refurbished' | 'used';
  conditionGrade?: 'A' | 'B' | 'C';
  warrantyMonths?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  count: number;
}

export interface Review {
  _id: string;
  productId: string;
  userId?: string;
  username?: string;
  customerName?: string;
  customerEmail?: string;
  rating: number;
  comment: string;
  isApproved?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface FeatureItem {
  icon: any;
  title: string;
  description: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface BusinessInfo {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
}