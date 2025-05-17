// src/infrastructure/persistence/repositories/booking-status.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingStatusEntity } from '../entities/booking-status.entity';
import { BookingStatusModel } from '../../../core/domain/models/booking-status.model';
import { QueryDto } from '../../../application/common/query.dto';

@Injectable()
export class BookingStatusRepository {
  constructor(
    @InjectRepository(BookingStatusEntity)
    private readonly bookingStatusRepository: Repository<BookingStatusEntity>,
  ) {}

  async findAll(query: QueryDto): Promise<BookingStatusModel[]> {
    const queryBuilder = this.bookingStatusRepository.createQueryBuilder('bookingStatus');
    
    // Apply select
    if (query.select && query.select.length > 0) {
      queryBuilder.select(query.select.map(field => `bookingStatus.${field}`));
    }
    
    const entities = await queryBuilder.getMany();
    return entities.map(entity => this.mapToModel(entity));
  }

  async findById(id: number): Promise<BookingStatusModel | null> {
    const entity = await this.bookingStatusRepository.findOne({
      where: { StatusId: id }
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async create(data: { StatusName: string, StatusDescription?: string }): Promise<BookingStatusModel> {
    const entity = this.bookingStatusRepository.create(data);
    const saved = await this.bookingStatusRepository.save(entity);
    return this.mapToModel(saved);
  }
  
  async update(id: number, data: Partial<{ StatusName: string, StatusDescription?: string }>): Promise<boolean> {
    const result = await this.bookingStatusRepository.update({ StatusId: id }, data);
    return result.affected > 0;
  }
  
  async delete(id: number): Promise<boolean> {
    const result = await this.bookingStatusRepository.delete({ StatusId: id });
    return result.affected > 0;
  }

  async findByName(statusName: string): Promise<BookingStatusModel | null> {
    const entity = await this.bookingStatusRepository.findOne({
      where: { StatusName: statusName }
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  private mapToModel(entity: BookingStatusEntity): BookingStatusModel {
    const model = new BookingStatusModel();
    model.StatusId = entity.StatusId;
    model.StatusName = entity.StatusName;
    model.Description = entity.Description;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}