import api from './api';
import { Cart } from '../types';

export const cartService = {
  async getCart(): Promise<Cart> {
    const res = await api.get('/cart/');
    return res.data;
  },

  async addToCart(productId: number, quantity = 1): Promise<{ message: string; cart: Cart }> {
    const res = await api.post('/cart/add/', { product_id: productId, quantity });
    return res.data;
  },

  async updateItemQuantity(itemId: number, quantity: number): Promise<{ message: string; cart: Cart }> {
    const res = await api.put(`/cart/items/${itemId}/`, { quantity });
    return res.data;
  },

  async removeItem(itemId: number): Promise<{ message: string; cart: Cart }> {
    const res = await api.delete(`/cart/items/${itemId}/remove/`);
    return res.data;
  },

  async clearCart(): Promise<{ message: string; cart: Cart }> {
    const res = await api.post('/cart/clear/');
    return res.data;
  }
};

