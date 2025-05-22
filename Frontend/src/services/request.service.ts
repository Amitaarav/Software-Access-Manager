import api from './api';
import { API_ENDPOINTS } from '../config/api';
import type { Request, AccessType, RequestStatus } from '../types';

export const requestService = {
  async createRequest(data: {
    softwareId: number;
    accessType: AccessType;
    reason: string;
  }): Promise<Request> {
    const response = await api.post(API_ENDPOINTS.requests.create, data);
    return response.data;
  },

  async getMyRequests(): Promise<Request[]> {
    const response = await api.get(API_ENDPOINTS.requests.myRequests);
    return response.data;
  },

  async getPendingRequests(): Promise<Request[]> {
    const response = await api.get(API_ENDPOINTS.requests.pending);
    return response.data;
  },

  async getAllRequests(): Promise<Request[]> {
    const response = await api.get(API_ENDPOINTS.requests.all);
    return response.data;
  },

  async updateRequestStatus(
    id: number,
    data: {
      status: RequestStatus;
      comment?: string;
    }
  ): Promise<Request> {
    const response = await api.put(API_ENDPOINTS.requests.updateStatus(id), data);
    return response.data;
  },

  async getRequestHistory(requestId: number): Promise<any[]> {
    const response = await api.get(API_ENDPOINTS.requests.history(requestId));
    return response.data;
  },

  async deleteRequest(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.requests.delete(id));
  }
}; 