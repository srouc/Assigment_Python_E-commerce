import api from './api';
import { Review } from '../types';

export const reviewService = {
  async getReviews(productSlugOrId: string | number): Promise<Review[]> {
    const res = await api.get(`/reviews/product/${productSlugOrId}/`);
    return Array.isArray(res.data) ? res.data : res.data.results || [];
  },

  async createReview(productSlugOrId: string | number, data: { rating: number; comment: string; reviewer_name?: string; title?: string }): Promise<Review> {
    const res = await api.post(`/reviews/product/${productSlugOrId}/`, data);
    return res.data;
  }
};

