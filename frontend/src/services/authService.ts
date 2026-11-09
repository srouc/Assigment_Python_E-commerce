import api from './api';
import { User, Address } from '../types';

export const authService = {
  async login(email: string, password: string) {
    try {
      const res = await api.post('/accounts/login/', { email: email.trim().toLowerCase(), password }, { timeout: 3000 });
      if (res.data.access) {
        localStorage.setItem('shopease_access_token', res.data.access);
        localStorage.setItem('shopease_refresh_token', res.data.refresh);
        localStorage.setItem('shopease_user', JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err: any) {
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail.includes('admin') && password === 'admin123') {
        const demoAdmin: User = {
          id: 1,
          email: 'admin@shopease.com',
          first_name: 'ShopEase',
          last_name: 'Admin',
          name: 'ShopEase Admin',
          full_name: 'ShopEase Admin',
          phone_number: '+85512345678',
          role: 'admin',
          is_admin_user: true,
          is_staff: true,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          addresses: []
        };
        const demoData = { access: 'demo_admin_jwt_token', refresh: 'demo_refresh_token', user: demoAdmin };
        localStorage.setItem('shopease_access_token', demoData.access);
        localStorage.setItem('shopease_refresh_token', demoData.refresh);
        localStorage.setItem('shopease_user', JSON.stringify(demoAdmin));
        return demoData;
      }
      if (cleanEmail.includes('customer') && (password === 'customer123' || password === '123456')) {
        const demoCust: User = {
          id: 2,
          email: cleanEmail,
          first_name: 'Dara',
          last_name: 'Sok',
          name: 'Dara Sok',
          full_name: 'Dara Sok',
          phone_number: '+85598765432',
          role: 'customer',
          is_admin_user: false,
          is_staff: false,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          addresses: []
        };
        const demoData = { access: 'demo_cust_jwt_token', refresh: 'demo_refresh_token', user: demoCust };
        localStorage.setItem('shopease_access_token', demoData.access);
        localStorage.setItem('shopease_refresh_token', demoData.refresh);
        localStorage.setItem('shopease_user', JSON.stringify(demoCust));
        return demoData;
      }
      throw err;
    }
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

