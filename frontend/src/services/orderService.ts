import api from './api';
import { Order } from '../types';

export interface CreateOrderPayload {
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  payment_method: 'cod' | 'card' | 'aba_khqr' | 'paypal';
  coupon_code?: string;
  guest_email?: string;
  notes?: string;
}

export const orderService = {
  async createOrder(data: CreateOrderPayload): Promise<Order> {
    const res = await api.post('/orders/', data);
    return res.data;
  },

  async getMyOrders(): Promise<Order[]> {
    const res = await api.get('/orders/');
    return res.data;
  },

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const res = await api.get(`/orders/${orderNumber}/`);
    return res.data;
  },

  async getAllOrdersAdmin(status?: string): Promise<Order[]> {
    const res = await api.get('/orders/admin/', { params: { status } });
    return Array.isArray(res.data) ? res.data : res.data.results || [];
  },

  async updateOrderStatusAdmin(orderId: number, status?: string, paymentStatus?: string): Promise<Order> {
    const res = await api.patch(`/orders/admin/${orderId}/status/`, {
      status,
      payment_status: paymentStatus
    });
    return res.data;
  }
};

