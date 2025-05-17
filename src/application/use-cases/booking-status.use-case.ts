// src/application/use-cases/booking-status.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { QueryDto } from '../common/query.dto';
import { BookingStatusServicePort } from '../ports/booking-status.port';
import { BookingStatusModel } from '../../core/domain/models/booking-status.model';
import { CreateBookingStatusDto, UpdateBookingStatusDto } from '../dtos/booking-status.dto';

@Injectable()
export class BookingStatusUseCase {
  constructor(
    @Inject('BookingStatusServicePort')
    private readonly service: BookingStatusServicePort
  ) {}

  async query(dto: QueryDto): Promise<BookingStatusModel | BookingStatusModel[]> {
    return this.service.query(dto);
  }

  async create(dto: CreateBookingStatusDto): Promise<BookingStatusModel> {
    return this.service.create(dto);
  }

  async update(id: number, dto: UpdateBookingStatusDto): Promise<boolean> {
    return this.service.update(id, dto);
  }

  async delete(id: number): Promise<boolean> {
    return this.service.delete(id);
  }

  async findByName(name: string): Promise<BookingStatusModel | null> {
    return this.service.findByName(name);
  }
}