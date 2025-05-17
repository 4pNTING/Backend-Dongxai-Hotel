// src/application/services/booking-status.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatusRepository } from '../../infrastructure/persistence/repositories/booking-status.repository';
import { QueryDto } from '../common/query.dto';
import { BookingStatusModel } from '../../core/domain/models/booking-status.model';
import { CreateBookingStatusDto, UpdateBookingStatusDto } from '../dtos/booking-status.dto';
import { BookingStatusServicePort } from '../ports/booking-status.port';

@Injectable()
export class BookingStatusService implements BookingStatusServicePort {
  constructor(private bookingStatusRepository: BookingStatusRepository) {}

  async query(dto: QueryDto): Promise<BookingStatusModel | BookingStatusModel[]> {
    if (dto.getType === 'one' && dto.filter && dto.filter.id) {
      const status = await this.bookingStatusRepository.findById(dto.filter.id);
      if (!status) {
        throw new NotFoundException(`Booking status with ID ${dto.filter.id} not found`);
      }
      return status;
    }
    return this.bookingStatusRepository.findAll(dto);
  }

  async create(dto: CreateBookingStatusDto): Promise<BookingStatusModel> {
    // สร้าง entity สำหรับ create
    const entity = {
      StatusName: dto.StatusName,
      StatusDescription: dto.StatusDescription
    };
    
    return this.bookingStatusRepository.create(entity);
  }

  async update(id: number, dto: UpdateBookingStatusDto): Promise<boolean> {
    const status = await this.bookingStatusRepository.findById(id);
    if (!status) {
      throw new NotFoundException(`Booking status with ID ${id} not found`);
    }
    
    return this.bookingStatusRepository.update(id, dto);
  }

  async delete(id: number): Promise<boolean> {
    const status = await this.bookingStatusRepository.findById(id);
    if (!status) {
      throw new NotFoundException(`Booking status with ID ${id} not found`);
    }
    
    return this.bookingStatusRepository.delete(id);
  }

  async findByName(name: string): Promise<BookingStatusModel | null> {
    return this.bookingStatusRepository.findByName(name);
  }
}