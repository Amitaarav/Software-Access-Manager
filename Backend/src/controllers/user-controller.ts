import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source.js';
import { User, UserRole } from '../entity/user-entity.js';
import { StatusCodes } from 'http-status-codes';

const userRepository = AppDataSource.getRepository(User);

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userRepository.findOne({ where: { id: req.user?.id } });
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
      return;
    }
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching user profile' });
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userRepository.findOne({ where: { id: req.user?.id } });
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
      return;
    }
    
    const updatedUser = await userRepository.save({ ...user, ...req.body });
    res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating user profile' });
  }
};

export const getUserStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await userRepository.createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();
    
    res.status(StatusCodes.OK).json(stats);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching user statistics' });
  }
};

export const searchUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    const users = await userRepository
      .createQueryBuilder('user')
      .where('user.username LIKE :query OR user.email LIKE :query', { query: `%${query}%` })
      .getMany();
    
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error searching users' });
  }
};

export const getUsersByRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.params;
    const users = await userRepository.find({ where: { role: role as UserRole } });
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching users by role' });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    const user = await userRepository.findOne({ where: { id: parseInt(userId) } });
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
      return;
    }
    
    user.role = role;
    await userRepository.save(user);
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating user role' });
  }
};

export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await userRepository.findOne({ where: { id: parseInt(userId) } });
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
      return;
    }
    
    user.isActive = !user.isActive;
    await userRepository.save(user);
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error toggling user status' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await userRepository.findOne({ where: { id: parseInt(userId) } });
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
      return;
    }
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching user' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userRepository.find();
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching users' });
  }
}; 