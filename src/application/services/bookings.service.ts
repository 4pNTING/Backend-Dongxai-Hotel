// src/application/services/booking.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingRepository } from '../../infrastructure/persistence/repositories/booking.repository';
import { QueryDto } from '../common/query.dto';
import { BookingModel } from '../../core/domain/models/booking.model';
import { CreateBookingDto, UpdateBookingDto } from '../dtos/booking.dto';
import { BookingServicePort } from '../ports/booking.prot';

@Injectable()
export class BookingService implements BookingServicePort {
  constructor(private bookingRepository: BookingRepository) {}

  async query(dto: QueryDto): Promise<BookingModel | BookingModel[]> {
    if (dto.getType === 'one' && dto.filter && dto.filter.id) {
      const booking = await this.bookingRepository.findById(dto.filter.id);
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${dto.filter.id} not found`);
      }
      return booking;
    }
    return this.bookingRepository.findAll(dto);
  }

  async create(dto: CreateBookingDto): Promise<BookingModel> {
    return this.bookingRepository.create(dto);
  }

  async update(id: number, dto: UpdateBookingDto): Promise<boolean> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    await this.bookingRepository.update(id, dto);
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return this.bookingRepository.delete(id);
  }
}