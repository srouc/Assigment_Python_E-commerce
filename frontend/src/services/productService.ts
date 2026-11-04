import api from './api';
import { Product, Category } from '../types';

export interface ProductFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  min_price?: number | string;
  max_price?: number | string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
  admin?: boolean;
}

export const productService = {
  async getProducts(params?: ProductFilters): Promise<Product[]> {
    const res = await api.get('/products/', { params });
    // In DRF standard list or paginated response
    return Array.isArray(res.data) ? res.data : res.data.results || [];
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const res = await api.get(`/products/${slug}/`);
    return res.data;
  },

  async getCategories(): Promise<Category[]> {
    const res = await api.get('/categories/');
    return Array.isArray(res.data) ? res.data : res.data.results || [];
  },

  async createProduct(data: FormData | Partial<Product>): Promise<Product> {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const res = await api.post('/products/', data, { headers });
    return res.data;
  },

  async updateProduct(slug: string, data: FormData | Partial<Product>): Promise<Product> {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const res = await api.patch(`/products/${slug}/`, data, { headers });
    return res.data;
  },

  async deleteProduct(slug: string): Promise<void> {
    await api.delete(`/products/${slug}/`);
  }
};

