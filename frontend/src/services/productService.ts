import api from './api';
import { Product, Category } from '../types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/fashionMockData';

export interface ProductFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  min_price?: number | string;
  max_price?: number | string;
  size?: string;
  color?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
  admin?: boolean;
}

export const productService = {
  async getProducts(params?: ProductFilters): Promise<Product[]> {
    try {
      const res = await api.get('/products/', { params, timeout: 1500 });
      const apiData = Array.isArray(res.data) ? res.data : res.data?.results || [];
      if (apiData.length > 0) return apiData;
    } catch {
      // Fallback to rich fashion mock data
    }

    let products = [...MOCK_PRODUCTS];

    if (params?.category) {
      const cat = params.category.toLowerCase();
      products = products.filter(
        (p) => p.category_slug?.toLowerCase() === cat || String(p.category) === cat
      );
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (params?.featured) {
      products = products.filter((p) => p.is_featured);
    }

    if (params?.size) {
      products = products.filter((p) => p.sizes?.includes(params.size!));
    }

    if (params?.color) {
      products = products.filter((p) =>
        p.colors?.some((c) => c.name.toLowerCase() === params.color!.toLowerCase())
      );
    }

    if (params?.min_price) {
      products = products.filter((p) => Number(p.price) >= Number(params.min_price));
    }

    if (params?.max_price) {
      products = products.filter((p) => Number(p.price) <= Number(params.max_price));
    }

    if (params?.sort) {
      if (params.sort === 'price_asc') products.sort((a, b) => Number(a.price) - Number(b.price));
      if (params.sort === 'price_desc') products.sort((a, b) => Number(b.price) - Number(a.price));
      if (params.sort === 'rating') products.sort((a, b) => Number(b.rating) - Number(a.rating));
      if (params.sort === 'newest') products.sort((a, b) => b.id - a.id);
    }

    return products;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const res = await api.get(`/products/${slug}/`, { timeout: 1500 });
      if (res.data) return res.data;
    } catch {
      // Fallback
    }

    const found = MOCK_PRODUCTS.find((p) => p.slug === slug || String(p.id) === slug);
    if (found) return found;
    return MOCK_PRODUCTS[0];
  },

  async getCategories(): Promise<Category[]> {
    try {
      const res = await api.get('/categories/', { timeout: 1500 });
      const apiCats = Array.isArray(res.data) ? res.data : res.data?.results || [];
      if (apiCats.length > 0) return apiCats;
    } catch {
      // Fallback
    }
    return MOCK_CATEGORIES;
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
  },
};
