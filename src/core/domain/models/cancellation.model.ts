// src/core/domain/models/cancellation.model.ts
import { BookingEntity } from '../../../infrastructure/persistence/entities/booking.entity';
import { StaffEntity } from '../../../infrastructure/persistence/entities/staff.entity';

export class CancellationModel {
  CancelId: number;
  CancelDate: Date;
  StaffId: number;
  BookingId: number;

  booking?: BookingEntity;
  staff?: StaffEntity;

 
}