
import { QueryDto } from '../common/query.dto';
import { BookingModel } from '../../core/domain/models/booking.model';
import { CreateBookingDto, UpdateBookingDto } from '../dtos/booking.dto';

export interface BookingServicePort {
  query(dto: QueryDto): Promise<BookingModel | BookingModel[]>;
  create(dto: CreateBookingDto): Promise<BookingModel>;
  update(id: number, dto: UpdateBookingDto): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}