// src/core/domain/models/check-in.model.ts
import { BookingEntity } from '../../../infrastructure/persistence/entities/booking.entity';
import { RoomEntity } from '../../../infrastructure/persistence/entities/room.entity';
import { CustomerEntity } from '../../../infrastructure/persistence/entities/customer.entity';
import { StaffEntity } from '../../../infrastructure/persistence/entities/staff.entity';
import { CheckOutEntity } from '../../../infrastructure/persistence/entities/check-out.entity';

export class CheckInModel {
  CheckinId: number;
  CheckinDate: Date;
  CheckoutDate: Date;
  RoomId: number;
  BookingId?: number;
  GuestId: number;
  StaffId: number;

  booking?: BookingEntity;
  room?: RoomEntity;
  customer?: CustomerEntity;
  staff?: StaffEntity;
  checkOuts?: CheckOutEntity[];

  constructor(params?: Partial<CheckInModel>) {
    if (params) {
      Object.assign(this, params);
    }
  }
}