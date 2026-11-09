import api from './api';
import { Cart, CartItem } from '../types';
import { MOCK_PRODUCTS } from '../data/fashionMockData';

const LOCAL_CART_KEY = 'shopease_mock_cart';

function getLocalCart(): Cart {
  if (typeof window === 'undefined') {
    return { id: 1, items: [], total_items: 0, subtotal: 0, updated_at: new Date().toISOString() };
  }
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { id: 1, items: [], total_items: 0, subtotal: 0, updated_at: new Date().toISOString() };
}

function saveLocalCart(cart: Cart) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
  }
}

export const cartService = {
  async getCart(): Promise<Cart> {
    try {
      const res = await api.get('/cart/', { timeout: 1500 });
      if (res.data?.items) return res.data;
    } catch {
      // Fallback
    }
    return getLocalCart();
  },

  async addToCart(
    productId: number,
    quantity = 1,
    size?: string,
    color?: string
  ): Promise<{ message: string; cart: Cart }> {
    try {
      const res = await api.post(
        '/cart/add/',
        { product_id: productId, quantity, size, color },
        { timeout: 1500 }
      );
      if (res.data?.cart) return res.data;
    } catch {
      // Fallback local cart
    }

    const cart = getLocalCart();
    const product = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product.id === productId &&
        item.selected_size === size &&
        item.selected_color === color
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].total_price =
        Number(product.price) * cart.items[existingIndex].quantity;
    } else {
      const firstCol = product.colors?.[0];
      const defaultCol = typeof firstCol === 'string' ? firstCol : (firstCol?.name || 'Default');
      const newItem: CartItem = {
        id: Date.now(),
        product,
        quantity,
        selected_size: size || product.sizes?.[0] || 'M',
        selected_color: color || defaultCol,
        total_price: Number(product.price) * quantity,
        created_at: new Date().toISOString(),
      };
      cart.items.push(newItem);
    }

    cart.total_items = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.subtotal = cart.items.reduce((sum, item) => sum + Number(item.total_price), 0);
    cart.updated_at = new Date().toISOString();
    saveLocalCart(cart);

    return { message: 'Item added to cart', cart };
  },

  async updateItemQuantity(itemId: number, quantity: number): Promise<{ message: string; cart: Cart }> {
    try {
      const res = await api.put(`/cart/items/${itemId}/`, { quantity }, { timeout: 1500 });
      if (res.data?.cart) return res.data;
    } catch {
      // Fallback
    }

    const cart = getLocalCart();
    const index = cart.items.findIndex((item) => item.id === itemId);
    if (index > -1) {
      if (quantity <= 0) {
        cart.items.splice(index, 1);
      } else {
        cart.items[index].quantity = quantity;
        cart.items[index].total_price = Number(cart.items[index].product.price) * quantity;
      }
    }

    cart.total_items = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.subtotal = cart.items.reduce((sum, item) => sum + Number(item.total_price), 0);
    saveLocalCart(cart);
    return { message: 'Cart updated', cart };
  },

  async removeItem(itemId: number): Promise<{ message: string; cart: Cart }> {
    try {
      const res = await api.delete(`/cart/items/${itemId}/remove/`, { timeout: 1500 });
      if (res.data?.cart) return res.data;
    } catch {
      // Fallback
    }

    const cart = getLocalCart();
    cart.items = cart.items.filter((item) => item.id !== itemId);
    cart.total_items = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.subtotal = cart.items.reduce((sum, item) => sum + Number(item.total_price), 0);
    saveLocalCart(cart);
    return { message: 'Item removed', cart };
  },

  async clearCart(): Promise<{ message: string; cart: Cart }> {
    try {
      const res = await api.post('/cart/clear/', {}, { timeout: 1500 });
      if (res.data?.cart) return res.data;
    } catch {
      // Fallback
    }

    const emptyCart: Cart = {
      id: 1,
      items: [],
      total_items: 0,
      subtotal: 0,
      updated_at: new Date().toISOString(),
    };
    saveLocalCart(emptyCart);
    return { message: 'Cart cleared', cart: emptyCart };
  },
};
