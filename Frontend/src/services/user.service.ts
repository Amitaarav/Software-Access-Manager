import api from './api';
import { API_ENDPOINTS } from '../config/api';
import type { User, UserRole } from '../types';

export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get(API_ENDPOINTS.users.profile);
    return response.data;
  },

  async getAllUsers(): Promise<User[]> {
    const response = await api.get(API_ENDPOINTS.users.all);
    return response.data;
  },

  async getUserById(id: number): Promise<User> {
    const response = await api.get(API_ENDPOINTS.users.byId(id));
    return response.data;
  },

  async updateUserRole(userId: number, role: UserRole): Promise<User> {
    const response = await api.put(API_ENDPOINTS.users.updateRole(userId), { role });
    return response.data;
  },

  async toggleUserStatus(userId: number, isActive: boolean): Promise<User> {
    const response = await api.put(API_ENDPOINTS.users.updateStatus(userId), { isActive });
    return response.data;
  },

  async getUserStatistics(): Promise<Record<UserRole, number>> {
    const response = await api.get(API_ENDPOINTS.users.statistics);
    return response.data;
  },

  async searchUsers(query: string): Promise<User[]> {
    const response = await api.get(API_ENDPOINTS.users.search, {
      params: { query }
    });
    return response.data;
  },

  async getUsersByRole(role: UserRole): Promise<User[]> {
    const response = await api.get(API_ENDPOINTS.users.byRole(role));
    return response.data;
  }
}; 