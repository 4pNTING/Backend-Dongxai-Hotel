// src/infrastructure/persistence/repositories/check-in.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckInEntity } from '../entities/check-in.entity';
import { CheckInModel } from '../../../core/domain/models/check-in.model';
import { QueryDto } from '../../../application/common/query.dto';
import { CreateCheckInDto, UpdateCheckInDto } from '../../../application/dtos/check-in.dto';

@Injectable()
export class CheckInRepository {
  constructor(
    @InjectRepository(CheckInEntity)
    private readonly checkInRepository: Repository<CheckInEntity>,
  ) {}

  async findAll(query: QueryDto): Promise<CheckInModel[]> {
    const queryBuilder = this.checkInRepository.createQueryBuilder('checkIn');
    
    // Apply select
    if (query.select && query.select.length > 0) {
      queryBuilder.select(query.select.map(field => `checkIn.${field}`));
    }
    
    // Apply relations
    if (query.relations && query.relations.length > 0) {
      query.relations.forEach(relation => {
        queryBuilder.leftJoinAndSelect(`checkIn.${relation}`, relation);
      });
    }
    
    // Apply filters
    if (query.filter) {
      Object.keys(query.filter).forEach(key => {
        queryBuilder.andWhere(`checkIn.${key} = :${key}`, { [key]: query.filter[key] });
      });
    }
    
    // Apply sorting
    if (query.orderBy) {
      Object.keys(query.orderBy).forEach(key => {
        queryBuilder.addOrderBy(`checkIn.${key}`, query.orderBy[key]);
      });
    } else if (query.orderByField) {
      queryBuilder.orderBy(`checkIn.${query.orderByField}`, query.order);
    } else {
      queryBuilder.orderBy('checkIn.CheckinDate', 'DESC');
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

  async findById(id: number, relations: string[] = []): Promise<CheckInModel | null> {
    const entity = await this.checkInRepository.findOne({
      where: { CheckinId: id },
      relations: relations
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async findByBookingId(bookingId: number): Promise<CheckInModel | null> {
    const entity = await this.checkInRepository.findOne({
      where: { BookingId: bookingId },
      relations: ['booking', 'room', 'customer', 'staff']
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async create(data: CreateCheckInDto): Promise<CheckInModel> {
    const entity = this.checkInRepository.create(data);
    
    const savedEntity = await this.checkInRepository.save(entity);
    return this.mapToModel(savedEntity);
  }

  async update(id: number, data: UpdateCheckInDto): Promise<CheckInModel> {
    const entity = await this.checkInRepository.findOne({
      where: { CheckinId: id }
    });
    
    if (!entity) {
      throw new NotFoundException(`Check-in with id ${id} not found`);
    }
    
    Object.assign(entity, data);
    
    const updatedEntity = await this.checkInRepository.save(entity);
    return this.mapToModel(updatedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.checkInRepository.delete(id);
    return result.affected > 0;
  }

  private mapToModel(entity: CheckInEntity): CheckInModel {
    return new CheckInModel({
      CheckinId: entity.CheckinId,
      CheckinDate: entity.CheckinDate,
      CheckoutDate: entity.CheckoutDate,
      RoomId: entity.RoomId,
      BookingId: entity.BookingId,
      GuestId: entity.GuestId,
      StaffId: entity.StaffId,
      booking: entity.booking,
      room: entity.room,
      customer: entity.customer,
      staff: entity.staff,
      checkOuts: entity.checkOuts
    });
  }
}