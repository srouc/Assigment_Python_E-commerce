import api from './api';
import { User, Address } from '../types';

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post('/accounts/login/', { email: email.trim().toLowerCase(), password });
    if (res.data.access) {
      localStorage.setItem('shopease_access_token', res.data.access);
      localStorage.setItem('shopease_refresh_token', res.data.refresh);
      localStorage.setItem('shopease_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async register(data: { email: string; password: string; confirm_password: string; full_name?: string; phone_number?: string }) {
    const res = await api.post('/accounts/register/', data);
    return res.data;
  },

  async getProfile(): Promise<User> {
    const res = await api.get('/accounts/profile/');
    return res.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const res = await api.patch('/accounts/profile/', data);
    localStorage.setItem('shopease_user', JSON.stringify(res.data));
    return res.data;
  },

  async getAddresses(): Promise<Address[]> {
    const res = await api.get('/accounts/addresses/');
    return res.data;
  },

  async createAddress(address: Omit<Address, 'id'>): Promise<Address> {
    const res = await api.post('/accounts/addresses/', address);
    return res.data;
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shopease_access_token');
      localStorage.removeItem('shopease_refresh_token');
      localStorage.removeItem('shopease_user');
    }
  },

  getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('shopease_user');
      return u ? JSON.parse(u) : null;
    }
    return null;
  }
};

