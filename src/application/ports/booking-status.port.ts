// src/application/ports/booking-status.port.ts
import { QueryDto } from '../common/query.dto';
import { BookingStatusModel } from '../../core/domain/models/booking-status.model';
import { CreateBookingStatusDto, UpdateBookingStatusDto } from '../dtos/booking-status.dto';

export interface BookingStatusServicePort {
  query(dto: QueryDto): Promise<BookingStatusModel | BookingStatusModel[]>;
  create(dto: CreateBookingStatusDto): Promise<BookingStatusModel>;
  update(id: number, dto: UpdateBookingStatusDto): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  findByName(name: string): Promise<BookingStatusModel | null>;
}