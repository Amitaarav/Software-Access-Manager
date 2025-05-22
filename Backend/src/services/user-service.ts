import { StatusCodes } from 'http-status-codes';
import { User, UserRole } from '../entity/user-entity.js';
import userRepository from '../repositories/user-repository.js';
import { logError, logInfo } from '../utils/logger.js';

class UserService {
  async getUserProfile(userId: number) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw {
          status: StatusCodes.NOT_FOUND,
          message: 'User not found'
        };
      }
      
      const { password, refreshToken, ...userProfile } = user;
      return userProfile;
    } catch (error) {
      logError('Error in UserService.getUserProfile', error);
      throw error;
    }
  }

  async updateUserProfile(userId: number, updateData: Partial<User>) {
    try {
      const { password, role, isActive, refreshToken, ...safeUpdateData } = updateData;

      if (safeUpdateData.email) {
        const existingUser = await userRepository.findByEmail(safeUpdateData.email);
        if (existingUser && existingUser.id !== userId) {
          throw {
            status: StatusCodes.CONFLICT,
            message: 'Email already in use'
          };
        }
      }

      if (safeUpdateData.username) {
        const existingUser = await userRepository.findByUsername(safeUpdateData.username);
        if (existingUser && existingUser.id !== userId) {
          throw {
            status: StatusCodes.CONFLICT,
            message: 'Username already in use'
          };
        }
      }

      const updatedUser = await userRepository.update(userId, safeUpdateData);
      if (!updatedUser) {
        throw {
          status: StatusCodes.NOT_FOUND,
          message: 'User not found'
        };
      }

      logInfo('User profile updated', { userId });
      const { password: _, refreshToken: __, ...userProfile } = updatedUser;
      return userProfile;
    } catch (error) {
      logError('Error in UserService.updateUserProfile', error);
      throw error;
    }
  }

  async updateUserRole(userId: number, role: UserRole, adminId: number) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw {
          status: StatusCodes.NOT_FOUND,
          message: 'User not found'
        };
      }

      if (userId === adminId) {
        throw {
          status: StatusCodes.FORBIDDEN,
          message: 'Cannot modify your own role'
        };
      }

      const updatedUser = await userRepository.updateUserRole(userId, role);
      logInfo('User role updated', { userId, oldRole: user.role, newRole: role, adminId });
      return updatedUser;
    } catch (error) {
      logError('Error in UserService.updateUserRole', error);
      throw error;
    }
  }

  async toggleUserStatus(userId: number, isActive: boolean, adminId: number) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw {
          status: StatusCodes.NOT_FOUND,
          message: 'User not found'
        };
      }

      if (userId === adminId) {
        throw {
          status: StatusCodes.FORBIDDEN,
          message: 'Cannot modify your own status'
        };
      }

      const updatedUser = await userRepository.updateUserStatus(userId, isActive);
      logInfo('User status updated', { 
        userId, 
        oldStatus: user.isActive, 
        newStatus: isActive, 
        adminId 
      });
      return updatedUser;
    } catch (error) {
      logError('Error in UserService.toggleUserStatus', error);
      throw error;
    }
  }

  async getUsersByRole(role: UserRole) {
    try {
      const users = await userRepository.findByRole(role);
      return users.map(user => {
        const { password, refreshToken, ...userWithoutSensitive } = user;
        return userWithoutSensitive;
      });
    } catch (error) {
      logError('Error in UserService.getUsersByRole', error);
      throw error;
    }
  }

  async getUserStatistics() {
    try {
      const [
        totalUsers,
        activeUsers,
        inactiveUsers,
        roleStats
      ] = await Promise.all([
        userRepository.findAll(),
        userRepository.getActiveUsers(),
        userRepository.getInactiveUsers(),
        userRepository.countByRole()
      ]);

      return {
        total: totalUsers.length,
        active: activeUsers.length,
        inactive: inactiveUsers.length,
        roleDistribution: roleStats
      };
    } catch (error) {
      logError('Error in UserService.getUserStatistics', error);
      throw error;
    }
  }

  async searchUsers(query: string) {
    try {
      const users = await userRepository.findAll();
      const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );

      return filteredUsers.map(user => {
        const { password, refreshToken, ...userWithoutSensitive } = user;
        return userWithoutSensitive;
      });
    } catch (error) {
      logError('Error in UserService.searchUsers', error);
      throw error;
    }
  }
}

export default new UserService();
