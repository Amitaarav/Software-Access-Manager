import api from './api';
import { API_ENDPOINTS } from '../config/api';
import type { Software, AccessType } from '../types';

export const softwareService = {
  async getAllSoftware(): Promise<Software[]> {
    const response = await api.get(API_ENDPOINTS.software.all);
    return response.data;
  },

  async getSoftwareById(id: number): Promise<Software> {
    const response = await api.get(API_ENDPOINTS.software.byId(id));
    return response.data;
  },

  async createSoftware(data: {
    name: string;
    description: string;
    accessLevels: AccessType[];
  }): Promise<Software> {
    const response = await api.post(API_ENDPOINTS.software.create, data);
    return response.data;
  },

  async updateSoftware(
    id: number,
    data: {
      name?: string;
      description?: string;
      accessLevels?: AccessType[];
    }
  ): Promise<Software> {
    const response = await api.put(API_ENDPOINTS.software.update(id), data);
    return response.data;
  },

  async deleteSoftware(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.software.delete(id));
  }
}; 