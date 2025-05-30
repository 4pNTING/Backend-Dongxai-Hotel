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
      where: { CheckinId: id }, // ใช้ CheckinId ตรงกับ Entity
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

  async findByCustomerId(customerId: number): Promise<CheckInModel[]> {
    // ใช้ GuestId เพราะในฐานข้อมูลใช้ GuestId
    const entities = await this.checkInRepository.find({
      where: { GuestId: customerId },
      relations: ['booking', 'room', 'customer', 'staff', 'checkOuts']
    });
    
    return entities.map(entity => this.mapToModel(entity));
  }

  async findByGuestId(guestId: number): Promise<CheckInModel[]> {
    const entities = await this.checkInRepository.find({
      where: { GuestId: guestId },
      relations: ['booking', 'room', 'customer', 'staff', 'checkOuts']
    });
    
    return entities.map(entity => this.mapToModel(entity));
  }

  async create(data: CreateCheckInDto | any): Promise<CheckInModel> {
    console.log('=== DEBUG: CheckInRepository.create ===');
    console.log('1. Received data:', JSON.stringify(data, null, 2));
    
    // แปลงข้อมูลจาก DTO ให้ตรงกับ Entity
    const entityData = {
      CheckinDate: data.CheckInDate, // DTO ใช้ CheckInDate -> Entity ใช้ CheckinDate
      CheckoutDate: data.CheckoutDate,
      RoomId: data.RoomId,
      BookingId: data.BookingId,
      GuestId: data.CustomerId, // DTO ใช้ CustomerId -> Entity ใช้ GuestId
      StaffId: data.StaffId
    };

    console.log('2. Converted entity data:', JSON.stringify(entityData, null, 2));

    const entity = this.checkInRepository.create(entityData);
    console.log('3. Created entity (before save):', JSON.stringify(entity, null, 2));
    
    try {
      const savedEntity = await this.checkInRepository.save(entity);
      console.log('4. Saved entity (after save):', JSON.stringify(savedEntity, null, 2));
      
      const model = this.mapToModel(savedEntity);
      console.log('5. Final model:', JSON.stringify(model, null, 2));
      
      return model;
    } catch (error) {
      console.error('6. ERROR during save:', error);
      console.error('   Error message:', error.message);
      console.error('   Error stack:', error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateCheckInDto): Promise<CheckInModel> {
    const entity = await this.checkInRepository.findOne({
      where: { CheckinId: id } // ใช้ CheckinId ตรงกับ Entity
    });
    
    if (!entity) {
      throw new NotFoundException(`Check-in with id ${id} not found`);
    }
    
    // แปลงข้อมูลจาก DTO ให้ตรงกับ Entity โดยไม่ใช้ type annotation
    const updateData = {};
    
    if (data.CheckInDate) {
      (updateData as any).CheckinDate = data.CheckInDate; // DTO -> Entity
    }
    if (data.CheckoutDate) {
      (updateData as any).CheckoutDate = data.CheckoutDate;
    }
    if (data.RoomId) {
      (updateData as any).RoomId = data.RoomId;
    }
    if (data.BookingId) {
      (updateData as any).BookingId = data.BookingId;
    }
    if (data.CustomerId) {
      (updateData as any).GuestId = data.CustomerId; // DTO -> Entity
    }
    if (data.StaffId) {
      (updateData as any).StaffId = data.StaffId;
    }
    
    Object.assign(entity, updateData);
    
    const updatedEntity = await this.checkInRepository.save(entity);
    return this.mapToModel(updatedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.checkInRepository.delete({ CheckinId: id });
    return result.affected > 0;
  }

  private mapToModel(entity: CheckInEntity): CheckInModel {
    return new CheckInModel({
      CheckInId: entity.CheckinId, // Entity: CheckinId -> Model: CheckInId
      CheckInDate: entity.CheckinDate, // Entity: CheckinDate -> Model: CheckInDate
      CheckoutDate: entity.CheckoutDate,
      RoomId: entity.RoomId,
      BookingId: entity.BookingId,
      CustomerId: entity.GuestId, // Entity: GuestId -> Model: CustomerId
      StaffId: entity.StaffId,
      booking: entity.booking,
      room: entity.room,
      customer: entity.customer,
      staff: entity.staff,
      checkOuts: entity.checkOuts
    });
  }
}