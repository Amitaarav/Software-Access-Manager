import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source.js';
import { Request } from '../entity/request-entity.js';
import { RequestHistory } from '../entity/request-history-entity.js';
import { logError } from '../utils/logger.js';

class RequestRepository {
  private repository: Repository<Request>;
  private historyRepository: Repository<RequestHistory>;

  constructor() {
    this.repository = AppDataSource.getRepository(Request);
    this.historyRepository = AppDataSource.getRepository(RequestHistory);
  }

  async create(requestData: Partial<Request>): Promise<Request> {
    try {
      const request = this.repository.create(requestData);
      return await this.repository.save(request);
    } catch (error) {
      logError('Error in RequestRepository.create', error);
      throw error;
    }
  }

  async findById(id: number, relations: string[] = []): Promise<Request | null> {
    try {
      return await this.repository.findOne({
        where: { id },
        relations
      });
    } catch (error) {
      logError('Error in RequestRepository.findById', error);
      throw error;
    }
  }

  async findByUserId(userId: number, relations: string[] = []): Promise<Request[]> {
    try {
      return await this.repository.find({
        where: { userId },
        relations,
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      logError('Error in RequestRepository.findByUserId', error);
      throw error;
    }
  }

  async findPendingRequests(relations: string[] = []): Promise<Request[]> {
    try {
      return await this.repository.find({
        where: { status: 'Pending' },
        relations,
        order: { createdAt: 'ASC' }
      });
    } catch (error) {
      logError('Error in RequestRepository.findPendingRequests', error);
      throw error;
    }
  }

  async updateStatus(
    requestId: number, 
    status: 'Approved' | 'Rejected', 
    managerId: number,
    comment?: string
  ): Promise<{ request: Request; history: RequestHistory }> {
    try {
      const request = await this.findById(requestId);
      if (!request) {
        throw new Error('Request not found');
      }

      const oldStatus = request.status;
      request.status = status;
      request.updatedAt = new Date();

      const historyRecord = this.historyRepository.create({
        requestId,
        changedById: managerId,
        oldStatus,
        newStatus: status,
        comment: comment || null
      });

      const [updatedRequest, savedHistory] = await Promise.all([
        this.repository.save(request),
        this.historyRepository.save(historyRecord)
      ]);

      return {
        request: updatedRequest,
        history: savedHistory
      };
    } catch (error) {
      logError('Error in RequestRepository.updateStatus', error);
      throw error;
    }
  }

  async getHistory(requestId: number): Promise<RequestHistory[]> {
    try {
      return await this.historyRepository.find({
        where: { requestId },
        relations: ['changedBy'],
        order: { changedAt: 'DESC' }
      });
    } catch (error) {
      logError('Error in RequestRepository.getHistory', error);
      throw error;
    }
  }
}

export default new RequestRepository(); 