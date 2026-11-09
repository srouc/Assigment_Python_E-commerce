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
      const filterCol = params.color.toLowerCase();
      products = products.filter((p) =>
        p.colors?.some((c) => {
          const cName = typeof c === 'string' ? c : (c?.name || '');
          return cName.toLowerCase() === filterCol;
        })
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
    try {
      const res = await api.post('/products/', data, { headers, timeout: 3000 });
      if (res.data) {
        const prod = res.data;
        MOCK_PRODUCTS.unshift(prod);
        return prod;
      }
    } catch (err) {
      console.warn('Backend API unavailable, saving product to local store:', err);
    }

    // Fallback in-memory creation
    const rawData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
    const nameStr = String(rawData.name || 'New Fashion Item');
    const slugStr = nameStr.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/[-\s]+/g, '-') + '-' + Date.now().toString().slice(-4);
    const imgUrl = String(rawData.main_image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800');
    const newProd: Product = {
      id: Date.now(),
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      name: nameStr,
      slug: slugStr,
      category: (rawData as any).category || 1,
      category_name: (rawData as any).category_name || 'Fashion & Apparel',
      category_slug: (rawData as any).category_slug || 'fashion-apparel',
      brand: String(rawData.brand || 'ShopEase Studio'),
      short_description: String(rawData.short_description || `${nameStr} - new arrival`),
      description: String(rawData.description || `${nameStr} crafted with premium fabrics and modern tailoring.`),
      price: String(rawData.price || '99.99'),
      stock_quantity: Number(rawData.stock_quantity || 10),
      is_in_stock: true,
      is_active: true,
      display_image: imgUrl,
      discount_percentage: 0,
      images: [
        {
          id: 1,
          image_url: imgUrl,
          display_image: imgUrl,
        }
      ],
      colors: [
        { name: 'Onyx Black', hex: '#111827' },
        { name: 'Pure White', hex: '#ffffff' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      rating: 5.0,
      reviews_count: 0,
      is_featured: false,
      created_at: new Date().toISOString(),
    };

    MOCK_PRODUCTS.unshift(newProd);
    return newProd;
  },

  async updateProduct(slug: string, data: FormData | Partial<Product>): Promise<Product> {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    try {
      const res = await api.patch(`/products/${slug}/`, data, { headers });
      return res.data;
    } catch {
      const found = MOCK_PRODUCTS.find((p) => p.slug === slug || String(p.id) === slug);
      if (found) {
        Object.assign(found, data);
        return found;
      }
      return MOCK_PRODUCTS[0];
    }
  },

  async deleteProduct(slug: string): Promise<void> {
    try {
      await api.delete(`/products/${slug}/`);
    } catch {
      // Ignored in fallback mode
    }
    const idx = MOCK_PRODUCTS.findIndex((p) => p.slug === slug || String(p.id) === slug);
    if (idx !== -1) {
      MOCK_PRODUCTS.splice(idx, 1);
    }
  },
};
