export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/v1';

export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    refreshToken: '/auth/refresh-token',
    logout: '/auth/logout'
  },
  
  users: {
    profile: '/users/profile',
    all: '/users',
    byId: (id: number) => `/users/${id}`,
    updateRole: (id: number) => `/users/${id}/role`,
    updateStatus: (id: number) => `/users/${id}/status`,
    statistics: '/users/statistics',
    search: '/users/search',
    byRole: (role: string) => `/users/by-role/${role}`
  },

  software: {
    all: '/software',
    byId: (id: number) => `/software/${id}`,
    create: '/software',
    update: (id: number) => `/software/${id}`,
    delete: (id: number) => `/software/${id}`
  },

  requests: {
    create: '/requests',
    myRequests: '/requests/my-requests',
    pending: '/requests/pending',
    all: '/requests',
    byId: (id: number) => `/requests/${id}`,
    updateStatus: (id: number) => `/requests/${id}/status`,
    history: (requestId: number) => `/requests/${requestId}/history`,
    delete: (id: number) => `/requests/${id}`
  }
}; 