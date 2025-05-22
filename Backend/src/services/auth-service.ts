import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { User } from '../entity/user-entity.js';
import userRepository from '../repositories/user-repository.js';
import { logError, logInfo } from '../utils/logger.js';

class AuthService {
  private generateTokens(user: User) {
    const accessToken = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key',
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  async register(username: string, email: string, password: string, role: string = 'Employee') {
    try {
      const existingUser = await userRepository.findByUsernameOrEmail(username) 
        || await userRepository.findByUsernameOrEmail(email);

      if (existingUser) {
        const field = existingUser.username === username ? 'Username' : 'Email';
        throw { 
          status: StatusCodes.BAD_REQUEST, 
          message: `${field} already exists` 
        };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await userRepository.create({
        username,
        email,
        password: hashedPassword,
        role: role as 'Employee' | 'Manager' | 'Admin'
      });

      logInfo('User registered successfully', { userId: user.id });
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      logError('Error in AuthService.register', error);
      throw error;
    }
  }

  async login(usernameOrEmail: string, password: string) {
    try {
      const user = await userRepository.findByUsernameOrEmail(usernameOrEmail);

      if (!user) {
        throw { 
          status: StatusCodes.UNAUTHORIZED, 
          message: 'Invalid credentials' 
        };
      }

      if (!user.isActive) {
        throw { 
          status: StatusCodes.UNAUTHORIZED, 
          message: 'Account is deactivated. Please contact administrator.' 
        };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw { 
          status: StatusCodes.UNAUTHORIZED, 
          message: 'Invalid credentials' 
        };
      }

      const tokens = this.generateTokens(user);
      await userRepository.updateRefreshToken(user.id, tokens.refreshToken);

      logInfo('User logged in successfully', { userId: user.id });
      const { password: _, refreshToken: __, ...userWithoutSensitiveInfo } = user;
      return {
        ...userWithoutSensitiveInfo,
        ...tokens
      };
    } catch (error) {
      logError('Error in AuthService.login', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key'
      ) as { id: number };

      const user = await userRepository.findByRefreshToken(refreshToken);

      if (!user || user.id !== decoded.id) {
        throw { 
          status: StatusCodes.UNAUTHORIZED, 
          message: 'Invalid refresh token' 
        };
      }

      const tokens = this.generateTokens(user);
      await userRepository.updateRefreshToken(user.id, tokens.refreshToken);

      logInfo('Token refreshed successfully', { userId: user.id });
      return tokens;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw { 
          status: StatusCodes.UNAUTHORIZED, 
          message: 'Refresh token expired' 
        };
      }
      logError('Error in AuthService.refreshToken', error);
      throw error;
    }
  }

  async logout(refreshToken: string) {
    try {
      const user = await userRepository.findByRefreshToken(refreshToken);
      if (user) {
        await userRepository.updateRefreshToken(user.id, null);
        logInfo('User logged out successfully', { userId: user.id });
      }
    } catch (error) {
      logError('Error in AuthService.logout', error);
      throw error;
    }
  }
}

export default new AuthService(); 