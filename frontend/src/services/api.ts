import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token and Session Key
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('shopease_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    let sessionKey = localStorage.getItem('shopease_session_key');
    if (!sessionKey) {
      sessionKey = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('shopease_session_key', sessionKey);
    }
    config.headers['X-Session-Key'] = sessionKey;
  }
  return config;
});

// Response interceptor for handling 401 token refresh if needed
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Token might be expired
      const refreshToken = localStorage.getItem('shopease_refresh_token');
      if (refreshToken && !error.config._retry) {
        error.config._retry = true;
        try {
          const res = await axios.post(`${API_BASE_URL}/accounts/refresh/`, {
            refresh: refreshToken,
          });
          const newAccess = res.data.access;
          localStorage.setItem('shopease_access_token', newAccess);
          error.config.headers.Authorization = `Bearer ${newAccess}`;
          return api(error.config);
        } catch {
          localStorage.removeItem('shopease_access_token');
          localStorage.removeItem('shopease_refresh_token');
          localStorage.removeItem('shopease_user');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

