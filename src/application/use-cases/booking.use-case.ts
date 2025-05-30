import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { QueryDto } from '../common/query.dto';
import { BookingServicePort } from '../ports/booking.prot';
import { BookingModel } from '../../core/domain/models/booking.model';
import { CreateBookingDto, UpdateBookingDto } from '../dtos/booking.dto';

@Injectable()
export class BookingUseCase {
  constructor(
    @Inject('BookingServicePort')
    private readonly service: BookingServicePort
  ) {}

  async query(dto: QueryDto): Promise<BookingModel | BookingModel[]> {
    return this.service.query(dto);
  }

  async create(dto: CreateBookingDto): Promise<BookingModel> {
    return this.service.create(dto);
  }

  async update(id: number, dto: UpdateBookingDto): Promise<boolean> {
    return this.service.update(id, dto);
  }

  async delete(id: number): Promise<boolean> {
    return this.service.delete(id);
  }

  // ===== เพิ่ม Methods สำหรับจัดการสถานะ =====
  
  async getPendingConfirmations(query?: QueryDto): Promise<BookingModel[]> {
    return this.service.getPendingConfirmations(query);
  }

  async getConfirmedBookings(query?: QueryDto): Promise<BookingModel[]> {
    return this.service.getConfirmedBookings(query);
  }

  async getCheckedInBookings(query?: QueryDto): Promise<BookingModel[]> {
    return this.service.getCheckedInBookings(query);
  }

  async confirmBooking(id: number): Promise<BookingModel> {
    return this.service.confirmBooking(id);
  }

  async checkinBooking(id: number): Promise<BookingModel> {
    return this.service.checkinBooking(id);
  }

  async checkoutBooking(id: number): Promise<BookingModel> {
    return this.service.checkoutBooking(id);
  }
}