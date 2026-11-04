import api from './api';

export const couponService = {
  async validateCoupon(code: string, subtotal: number) {
    const res = await api.post('/coupons/validate/', {
      code,
      subtotal,
    });
    return res.data;
  },

  async getAllCouponsAdmin() {
    const res = await api.get('/coupons/admin/');
    return Array.isArray(res.data) ? res.data : res.data.results || [];
  },

  async createCouponAdmin(data: any) {
    const res = await api.post('/coupons/admin/', data);
    return res.data;
  },

  async deleteCouponAdmin(id: number) {
    await api.delete(`/coupons/admin/${id}/`);
  }
};

