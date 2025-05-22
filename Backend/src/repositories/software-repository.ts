import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source.js';
import { Software } from '../entity/software-entity.js';
import { logError } from '../utils/logger.js';

class SoftwareRepository {
  private repository: Repository<Software>;

  constructor() {
    this.repository = AppDataSource.getRepository(Software);
  }

  async create(softwareData: Partial<Software>): Promise<Software> {
    try {
      const software = this.repository.create(softwareData);
      return await this.repository.save(software);
    } catch (error) {
      logError('Error in SoftwareRepository.create', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Software | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      logError('Error in SoftwareRepository.findById', error);
      throw error;
    }
  }

  async findAll(): Promise<Software[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      logError('Error in SoftwareRepository.findAll', error);
      throw error;
    }
  }

  async update(id: number, softwareData: Partial<Software>): Promise<Software | null> {
    try {
      await this.repository.update(id, softwareData);
      return this.findById(id);
    } catch (error) {
      logError('Error in SoftwareRepository.update', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      logError('Error in SoftwareRepository.delete', error);
      throw error;
    }
  }

  async findByName(name: string): Promise<Software | null> {
    try {
      return await this.repository.findOne({ where: { name } });
    } catch (error) {
      logError('Error in SoftwareRepository.findByName', error);
      throw error;
    }
  }
}

export default new SoftwareRepository(); 