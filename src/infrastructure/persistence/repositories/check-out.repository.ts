// src/infrastructure/persistence/repositories/check-out.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckOutEntity } from '../entities/check-out.entity';
import { CheckOutModel } from '../../../core/domain/models/check-out.model';
import { QueryDto } from '../../../application/common/query.dto';
import { CreateCheckOutDto, UpdateCheckOutDto } from '../../../application/dtos/check-out.dto';

@Injectable()
export class CheckOutRepository {
  constructor(
    @InjectRepository(CheckOutEntity)
    private readonly checkOutRepository: Repository<CheckOutEntity>,
  ) {}

  async findAll(query: QueryDto): Promise<CheckOutModel[]> {
    const queryBuilder = this.checkOutRepository.createQueryBuilder('checkOut');
    
    // Apply select
    if (query.select && query.select.length > 0) {
      queryBuilder.select(query.select.map(field => `checkOut.${field}`));
    }
    
    // Apply relations
    if (query.relations && query.relations.length > 0) {
      query.relations.forEach(relation => {
        queryBuilder.leftJoinAndSelect(`checkOut.${relation}`, relation);
      });
    }
    
    // Apply filters
    if (query.filter) {
      Object.keys(query.filter).forEach(key => {
        queryBuilder.andWhere(`checkOut.${key} = :${key}`, { [key]: query.filter[key] });
      });
    }
    
    // Apply sorting
    if (query.orderBy) {
      Object.keys(query.orderBy).forEach(key => {
        queryBuilder.addOrderBy(`checkOut.${key}`, query.orderBy[key]);
      });
    } else if (query.orderByField) {
      queryBuilder.orderBy(`checkOut.${query.orderByField}`, query.order);
    } else {
      queryBuilder.orderBy('checkOut.CheckoutDate', 'DESC');
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

  async findById(id: number, relations: string[] = []): Promise<CheckOutModel | null> {
    const entity = await this.checkOutRepository.findOne({
      where: { CheckoutId: id },
      relations: relations
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async findByCheckInId(checkInId: number): Promise<CheckOutModel | null> {
    const entity = await this.checkOutRepository.findOne({
      where: { CheckinId: checkInId },
      relations: ['checkIn', 'room', 'staff']
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async create(data: CreateCheckOutDto): Promise<CheckOutModel> {
    const entity = this.checkOutRepository.create(data);
    
    const savedEntity = await this.checkOutRepository.save(entity);
    return this.mapToModel(savedEntity);
  }

  async update(id: number, data: UpdateCheckOutDto): Promise<CheckOutModel> {
    const entity = await this.checkOutRepository.findOne({
      where: { CheckoutId: id }
    });
    
    if (!entity) {
      throw new NotFoundException(`Check-out with id ${id} not found`);
    }
    
    Object.assign(entity, data);
    
    const updatedEntity = await this.checkOutRepository.save(entity);
    return this.mapToModel(updatedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.checkOutRepository.delete(id);
    return result.affected > 0;
  }

  private mapToModel(entity: CheckOutEntity): CheckOutModel {
    return new CheckOutModel({
      CheckoutId: entity.CheckoutId,
      CheckoutDate: entity.CheckoutDate,
      CheckinId: entity.CheckinId,
      RoomId: entity.RoomId,
      StaffId: entity.StaffId,
      checkIn: entity.checkIn,
      room: entity.room,
      staff: entity.staff,
      payments: entity.payments
    });
  }
}