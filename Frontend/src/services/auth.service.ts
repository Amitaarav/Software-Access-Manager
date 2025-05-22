import api from './api';
import { API_ENDPOINTS } from '../config/api';
import type { AuthResponse } from '../types';

export const authService = {
  async login(usernameOrEmail: string, password: string): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.auth.login, {
      usernameOrEmail,
      password
    });
    return response.data;
  },

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.auth.register, {
      username,
      email,
      password
    });
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await api.post(API_ENDPOINTS.auth.refreshToken, {
      refreshToken
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.auth.logout);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
}; 