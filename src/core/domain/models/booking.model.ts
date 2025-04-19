// src/core/domain/models/booking.model.ts
import { RoomEntity } from '../../../infrastructure/persistence/entities/room.entity';
import { CustomerEntity } from '../../../infrastructure/persistence/entities/customer.entity';
import { StaffEntity } from '../../../infrastructure/persistence/entities/staff.entity';
import { CheckInEntity } from '../../../infrastructure/persistence/entities/check-in.entity';
import { CancellationEntity } from '../../../infrastructure/persistence/entities/cancellation.entity';

export class BookingModel {
  BookingId: number;
  BookingDate: Date;
  RoomId: number;
  CheckinDate: Date;
  CheckoutDate: Date;
  GuestId: number;
  StaffId: number;

  room?: RoomEntity;
  customer?: CustomerEntity;
  staff?: StaffEntity;
  checkIns?: CheckInEntity[];
  cancellations?: CancellationEntity[];

  constructor(params?: Partial<BookingModel>) {
    if (params) {
      Object.assign(this, params);
    }
  }
}