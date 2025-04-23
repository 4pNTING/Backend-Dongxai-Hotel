// src/infrastructure/persistence/repositories/booking.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity } from '../entities/booking.entity';
import { BookingModel } from '../../../core/domain/models/booking.model';
import { QueryDto } from '../../../application/common/query.dto';
import { CreateBookingDto, UpdateBookingDto } from '../../../application/dtos/booking.dto';

@Injectable()
export class BookingRepository {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
  ) {}

  async findAll(query: QueryDto): Promise<BookingModel[]> {
    const queryBuilder = this.bookingRepository.createQueryBuilder('booking');
    
    // Apply select
    if (query.select && query.select.length > 0) {
      queryBuilder.select(query.select.map(field => `booking.${field}`));
    }
    
    // Apply relationsSV
    if (query.relations && query.relations.length > 0) {
      query.relations.forEach(relation => {
        queryBuilder.leftJoinAndSelect(`booking.${relation}`, relation);
      });
    }
    
    // Apply filters
    if (query.filter) {
      Object.keys(query.filter).forEach(key => {
        queryBuilder.andWhere(`booking.${key} = :${key}`, { [key]: query.filter[key] });
      });
    }
    
    // Apply sorting
    if (query.orderBy) {
      Object.keys(query.orderBy).forEach(key => {
        queryBuilder.addOrderBy(`booking.${key}`, query.orderBy[key]);
      });
    } else if (query.orderByField) {
      queryBuilder.orderBy(`booking.${query.orderByField}`, query.order);
    } else {
      queryBuilder.orderBy('booking.BookingDate', 'DESC');
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

  async findById(id: number): Promise<BookingModel | null> {
    const entity = await this.bookingRepository.findOne({
      where: { BookingId: id },
      relations: ['room', 'customer', 'staff']
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async findByCustomerId(guestId: number): Promise<BookingModel[]> {
    const entities = await this.bookingRepository.find({
      where: { GuestId: guestId },
      relations: ['room', 'customer', 'staff'],
      order: { BookingDate: 'DESC' }
    });
    
    return entities.map(entity => this.mapToModel(entity));
  }

  async create(data: CreateBookingDto): Promise<BookingModel> {
    const entity = this.bookingRepository.create({
      ...data,
    });
    
    const savedEntity = await this.bookingRepository.save(entity);
    return this.mapToModel(savedEntity);
  }

  async update(id: number, data: UpdateBookingDto): Promise<BookingModel> {
    const entity = await this.bookingRepository.findOne({
      where: { BookingId: id },
    });
    
    if (!entity) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    
    Object.assign(entity, data);
    
    const updatedEntity = await this.bookingRepository.save(entity);
    return this.mapToModel(updatedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.bookingRepository.delete(id);
    return result.affected > 0;
  }

  private mapToModel(entity: BookingEntity): BookingModel {
    const model = new BookingModel();
    model.BookingId = entity.BookingId;
    model.BookingDate = entity.BookingDate;
    model.RoomId = entity.RoomId;
    model.CheckinDate = entity.CheckinDate;
    model.CheckoutDate = entity.CheckoutDate;
    model.GuestId = entity.GuestId;
    model.StaffId = entity.StaffId;
    model.BookingStatus = entity.BookingStatus; // เพิ่มบรรทัดนี้
    model.CreatedAt = entity.CreatedAt; // เพิ่มฟิลด์นี้ด้วยถ้าต้องการ
    
    // Add related entities if they exist
    if (entity.room) model.room = entity.room;
    if (entity.customer) model.customer = entity.customer;
    if (entity.staff) model.staff = entity.staff;
    if (entity.checkIns) model.checkIns = entity.checkIns;
    if (entity.cancellations) model.cancellations = entity.cancellations;
    
    return model;
  }
}