// src/application/services/bookings.service.ts (Simplified)
import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../../infrastructure/persistence/repositories/booking.repository';
import { QueryDto } from '../common/query.dto';
import { BookingModel } from '../../core/domain/models/booking.model';
import { CreateBookingDto, UpdateBookingDto } from '../dtos/booking.dto';
import { BookingServicePort } from '../ports/booking.prot';

@Injectable()
export class BookingService implements BookingServicePort {
  constructor(private bookingRepository: BookingRepository) {}

  // ===== Basic CRUD - ส่งต่อไปยัง Repository =====
  
  async query(dto: QueryDto): Promise<BookingModel | BookingModel[]> {
    if (dto.getType === 'one' && dto.filter && dto.filter.id) {
      return this.bookingRepository.findById(dto.filter.id);
    }
    return this.bookingRepository.findAll(dto);
  }

  async create(dto: CreateBookingDto): Promise<BookingModel> {
    return this.bookingRepository.create(dto);
  }

  async update(id: number, dto: UpdateBookingDto): Promise<boolean> {
    await this.bookingRepository.update(id, dto);
    return true;
  }

  async delete(id: number): Promise<boolean> {
    return this.bookingRepository.delete(id);
  }

  // ===== Status Management - ส่งต่อไปยัง Repository =====
  
  async getPendingConfirmations(customQuery?: QueryDto): Promise<BookingModel[]> {
    return this.bookingRepository.getPendingConfirmations(customQuery);
  }

  async getConfirmedBookings(customQuery?: QueryDto): Promise<BookingModel[]> {
    return this.bookingRepository.getConfirmedBookings(customQuery);
  }

  async getCheckedInBookings(customQuery?: QueryDto): Promise<BookingModel[]> {
    return this.bookingRepository.getCheckedInBookings(customQuery);
  }

  async getCancelledBookings(customQuery?: QueryDto): Promise<BookingModel[]> {
    return this.bookingRepository.getCancelledBookings(customQuery);
  }

  async getCompletedBookings(customQuery?: QueryDto): Promise<BookingModel[]> {
    return this.bookingRepository.getCompletedBookings(customQuery);
  }

  // ===== Workflow Methods - ส่งต่อไปยัง Repository =====

  async confirmBooking(id: number): Promise<BookingModel> {
    return this.bookingRepository.confirmBooking(id);
  }

  async checkinBooking(id: number): Promise<BookingModel> {
    return this.bookingRepository.checkinBooking(id);
  }

  async checkoutBooking(id: number): Promise<BookingModel> {
    return this.bookingRepository.checkoutBooking(id);
  }

  async cancelBooking(id: number): Promise<BookingModel> {
    return this.bookingRepository.cancelBooking(id);
  }

  // ===== Statistics - ส่งต่อไปยัง Repository =====

  async getBookingStats(): Promise<{
    pending: number;
    confirmed: number;
    checkedIn: number;
    completed: number;
    cancelled: number;
  }> {
    return this.bookingRepository.getBookingStats();
  }
}