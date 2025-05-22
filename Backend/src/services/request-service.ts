import { StatusCodes } from 'http-status-codes';
import { Request } from '../entity/request-entity.js';
import { RequestHistory } from '../entity/request-history-entity.js';
import requestRepository from '../repositories/request-repository.js';
import softwareRepository from '../repositories/software-repository.js';
import { logError, logInfo } from '../utils/logger.js';

class RequestService {
  async createRequest(userId: number, softwareId: number, accessType: string, reason: string) {
    try {
      const software = await softwareRepository.findById(softwareId);
      if (!software) {
        throw {
          status: StatusCodes.NOT_FOUND,
          message: 'Software not found'
        };
      }

      if (!software.accessLevels.includes(accessType)) {
        throw {
          status: StatusCodes.BAD_REQUEST,
          message: `Invalid access type. Available types: ${software.accessLevels.join(', ')}`
        };
      }

      const request = await requestRepository.create({
        userId,
        softwareId,
        accessType: accessType as 'Read' | 'Write' | 'Admin',
        reason,
        status: 'Pending'
      });

      logInfo('Access request created', { requestId: request.id, userId });
      return request;
    } catch (error) {
      logError('Error in RequestService.createRequest', error);
      throw error;
    }
  }

  async getUserRequests(userId: number) {
    try {
      const requests = await requestRepository.findByUserId(userId, ['software']);
      return requests;
    } catch (error) {
      logError('Error in RequestService.getUserRequests', error);
      throw error;
    }
  }

  async getPendingRequests() {
    try {
      const requests = await requestRepository.findPendingRequests(['user', 'software']);
      return requests;
    } catch (error) {
      logError('Error in RequestService.getPendingRequests', error);
      throw error;
    }
  }

  async updateRequestStatus(requestId: number, managerId: number, status: 'Approved' | 'Rejected', comment?: string) {
    try {
      const result = await requestRepository.updateStatus(requestId, status, managerId, comment);
      logInfo('Request status updated', { 
        requestId, 
        managerId, 
        oldStatus: result.history.oldStatus, 
        newStatus: status 
      });
      return result;
    } catch (error) {
      logError('Error in RequestService.updateRequestStatus', error);
      throw error;
    }
  }

  async getRequestHistory(requestId: number) {
    try {
      const history = await requestRepository.getHistory(requestId);
      return history;
    } catch (error) {
      logError('Error in RequestService.getRequestHistory', error);
      throw error;
    }
  }
}

export default new RequestService(); 