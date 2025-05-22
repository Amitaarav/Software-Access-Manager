export type UserRole = 'Admin' | 'Manager' | 'User';
export type AccessType = 'Read' | 'Write' | 'Admin';
export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface Software {
  id: number;
  name: string;
  description: string;
  accessLevels: AccessType[];
}

export interface Request {
  id: number;
  userId: number;
  softwareId: number;
  accessType: AccessType;
  reason: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt?: string;
  software?: Software;
  user?: User;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: { field: string; message: string }[];
} 