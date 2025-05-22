import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source.js';
import { User } from '../entity/user-entity.js';
import { logError } from '../utils/logger.js';
import { UserRole } from '../entity/user-entity.js';

class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findById(id: number): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      logError('Error in UserRepository.findById', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { email } });
    } catch (error) {
      logError('Error in UserRepository.findByEmail', error);
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { username } });
    } catch (error) {
      logError('Error in UserRepository.findByUsername', error);
      throw error;
    }
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    try {
      return await this.repository.findOne({
        where: [
          { username: usernameOrEmail },
          { email: usernameOrEmail }
        ]
      });
    } catch (error) {
      logError('Error in UserRepository.findByUsernameOrEmail', error);
      throw error;
    }
  }

  async create(userData: Partial<User>): Promise<User> {
    try {
      const user = this.repository.create(userData);
      return await this.repository.save(user);
    } catch (error) {
      logError('Error in UserRepository.create', error);
      throw error;
    }
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    try {
      await this.repository.update(id, userData);
      return this.findById(id);
    } catch (error) {
      logError('Error in UserRepository.update', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      logError('Error in UserRepository.delete', error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      logError('Error in UserRepository.findAll', error);
      throw error;
    }
  }

  async updateRefreshToken(id: number, refreshToken: string | null): Promise<void> {
    try {
      await this.repository.update(id, { refreshToken });
    } catch (error) {
      logError('Error in UserRepository.updateRefreshToken', error);
      throw error;
    }
  }

  async findByRefreshToken(refreshToken: string): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { refreshToken } });
    } catch (error) {
      logError('Error in UserRepository.findByRefreshToken', error);
      throw error;
    }
  }

  async findByRole(role: UserRole): Promise<User[]> {
    try {
      return await this.repository.find({ where: { role } });
    } catch (error) {
      logError('Error in UserRepository.findByRole', error);
      throw error;
    }
  }

  async updateUserStatus(id: number, isActive: boolean): Promise<User | null> {
    try {
      await this.repository.update(id, { isActive });
      return this.findById(id);
    } catch (error) {
      logError('Error in UserRepository.updateUserStatus', error);
      throw error;
    }
  }

  async updateUserRole(id: number, role: UserRole): Promise<User | null> {
    try {
      await this.repository.update(id, { role });
      return this.findById(id);
    } catch (error) {
      logError('Error in UserRepository.updateUserRole', error);
      throw error;
    }
  }

  async getActiveUsers(): Promise<User[]> {
    try {
      return await this.repository.find({ where: { isActive: true } });
    } catch (error) {
      logError('Error in UserRepository.getActiveUsers', error);
      throw error;
    }
  }

  async getInactiveUsers(): Promise<User[]> {
    try {
      return await this.repository.find({ where: { isActive: false } });
    } catch (error) {
      logError('Error in UserRepository.getInactiveUsers', error);
      throw error;
    }
  }

  async countByRole(): Promise<Record<UserRole, number>> {
    try {
      const users = await this.repository.find();
      return users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<UserRole, number>);
    } catch (error) {
      logError('Error in UserRepository.countByRole', error);
      throw error;
    }
  }
}

export default new UserRepository();