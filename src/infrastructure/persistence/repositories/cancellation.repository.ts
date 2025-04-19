// src/infrastructure/persistence/repositories/cancellation.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CancellationEntity } from '../entities/cancellation.entity';
import { CancellationModel } from '../../../core/domain/models/cancellation.model';
import { QueryDto } from '../../../application/common/query.dto';
import { CreateCancellationDto, UpdateCancellationDto } from '../../../application/dtos/cancellation.dto';

@Injectable()
export class CancellationRepository {
  constructor(
    @InjectRepository(CancellationEntity)
    private readonly cancellationRepository: Repository<CancellationEntity>,
  ) {}

  async findAll(query: QueryDto): Promise<CancellationModel[]> {
    const queryBuilder = this.cancellationRepository.createQueryBuilder('cancellation');
    
    // Apply select
    if (query.select && query.select.length > 0) {
      queryBuilder.select(query.select.map(field => `cancellation.${field}`));
    }
    
    // Apply relations
    if (query.relations && query.relations.length > 0) {
      query.relations.forEach(relation => {
        queryBuilder.leftJoinAndSelect(`cancellation.${relation}`, relation);
      });
    }
    
    // Apply filters
    if (query.filter) {
      Object.keys(query.filter).forEach(key => {
        queryBuilder.andWhere(`cancellation.${key} = :${key}`, { [key]: query.filter[key] });
      });
    }
    
    // Apply sorting
    if (query.orderBy) {
      Object.keys(query.orderBy).forEach(key => {
        queryBuilder.addOrderBy(`cancellation.${key}`, query.orderBy[key]);
      });
    } else if (query.orderByField) {
      queryBuilder.orderBy(`cancellation.${query.orderByField}`, query.order);
    } else {
      queryBuilder.orderBy('cancellation.CancelDate', 'DESC');
    }
    
    // Apply pagination
    if (query.skip !== undefined) {
      queryBuilder.skip(query.skip);
    }
    
    if (query.take !== undefined) {
      queryBuilder.take(query.take);
    }
    
    const entities = await queryBuilder.getMany();
    return entities.map(entity => this.mapToModel(entity));
  }

  async findById(id: number, relations: string[] = []): Promise<CancellationModel | null> {
    const entity = await this.cancellationRepository.findOne({
      where: { CancelId: id },
      relations: relations
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async findByBookingId(bookingId: number): Promise<CancellationModel | null> {
    const entity = await this.cancellationRepository.findOne({
      where: { BookingId: bookingId },
      relations: ['booking', 'staff']
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async create(data: CreateCancellationDto): Promise<CancellationModel> {
    const entity = this.cancellationRepository.create(data);
    
    const savedEntity = await this.cancellationRepository.save(entity);
    return this.mapToModel(savedEntity);
  }

  async update(id: number, data: UpdateCancellationDto): Promise<CancellationModel> {
    const entity = await this.cancellationRepository.findOne({
      where: { CancelId: id }
    });
    
    if (!entity) {
      throw new NotFoundException(`Cancellation with id ${id} not found`);
    }
    
    Object.assign(entity, data);
    
    const updatedEntity = await this.cancellationRepository.save(entity);
    return this.mapToModel(updatedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.cancellationRepository.delete(id);
    return result.affected > 0;
  }

  private mapToModel(entity: CancellationEntity): CancellationModel {
    return new CancellationModel({
      CancelId: entity.CancelId,
      CancelDate: entity.CancelDate,
      StaffId: entity.StaffId,
      BookingId: entity.BookingId,
      booking: entity.booking,
      staff: entity.staff
    });
  }
}