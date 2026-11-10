import api from './api';

export interface TelegramConfig {
  configured: boolean;
  bot_token_masked?: string;
  chat_id: string;
  enabled: boolean;
}

export const telegramService = {
  getConfig: async (): Promise<TelegramConfig> => {
    const res = await api.get('/telegram/config/');
    return res.data;
  },

  saveConfig: async (data: { bot_token?: string; chat_id: string; enabled?: boolean }) => {
    const res = await api.post('/telegram/config/', data);
    return res.data;
  },

  testConnection: async (data?: { bot_token?: string; chat_id?: string }) => {
    const res = await api.post('/telegram/test/', data || {});
    return res.data;
  },
};
