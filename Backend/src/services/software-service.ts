import { StatusCodes } from 'http-status-codes';
import { Software } from '../entity/software-entity.js';
import softwareRepository from '../repositories/software-repository.js';
import { logError, logInfo } from '../utils/logger.js';

class SoftwareService {
  async createSoftware(name: string, description: string, accessLevels: string[]) {
    try {
      const existingSoftware = await softwareRepository.findByName(name);
      if (existingSoftware) {
        throw {
          status: StatusCodes.CONFLICT,
          message: 'Software with this name already exists'
        };
      }

      const validAccessLevels = ['Read', 'Write', 'Admin'];
      const invalidLevels = accessLevels.filter(level => !validAccessLevels.includes(level));
      if (invalidLevels.length > 0) {
        throw {
          status: StatusCodes.BAD_REQUEST,
          message: `Invalid access levels: ${invalidLevels.join(', ')}`
        };
      }

      const software = await softwareRepository.create({
        name,
        description,
        accessLevels
      });

      logInfo('Software created', { softwareId: software.id });
      return software;
    } catch (error) {
      logError('Error in SoftwareService.createSoftware', error);
      throw error;
    }
  }

  async updateSoftware(id: number, updateData: Partial<Software>) {
    try {
      const software = await softwareRepository.findById(id);
      if (!software) {
        throw {
          status: StatusCodes.NOT_FOUND,
          message: 'Software not found'
        };
      }

      if (updateData.accessLevels) {
        const validAccessLevels = ['Read', 'Write', 'Admin'];
        const invalidLevels = updateData.accessLevels.filter(
          level => !validAccessLevels.includes(level)
        );
        if (invalidLevels.length > 0) {
          throw {
            status: StatusCodes.BAD_REQUEST,
            message: `Invalid access levels: ${invalidLevels.join(', ')}`
          };
        }
      }

      if (updateData.name && updateData.name !== software.name) {
        const existingSoftware = await softwareRepository.findByName(updateData.name);
        if (existingSoftware) {
          throw {
            status: StatusCodes.CONFLICT,
            message: 'Software with this name already exists'
          };
        }
      }

      const updatedSoftware = await softwareRepository.update(id, updateData);
      logInfo('Software updated', { softwareId: id });
      return updatedSoftware;
    } catch (error) {
      logError('Error in SoftwareService.updateSoftware', error);
      throw error;
    }
  }

  async deleteSoftware(id: number) {
    try {
      const software = await softwareRepository.findById(id);
      if (!software) {
        throw {
          status: StatusCodes.NOT_FOUND,
          message: 'Software not found'
        };
      }

      await softwareRepository.delete(id);
      logInfo('Software deleted', { softwareId: id });
      return true;
    } catch (error) {
      logError('Error in SoftwareService.deleteSoftware', error);
      throw error;
    }
  }

  async getSoftware(id: number) {
    try {
      const software = await softwareRepository.findById(id);
      if (!software) {
        throw {
          status: StatusCodes.NOT_FOUND,
          message: 'Software not found'
        };
      }
      return software;
    } catch (error) {
      logError('Error in SoftwareService.getSoftware', error);
      throw error;
    }
  }

  async getAllSoftware() {
    try {
      return await softwareRepository.findAll();
    } catch (error) {
      logError('Error in SoftwareService.getAllSoftware', error);
      throw error;
    }
  }
}

export default new SoftwareService(); 