// src/core/domain/models/check-out.model.ts
import { CheckInEntity } from '../../../infrastructure/persistence/entities/check-in.entity';
import { RoomEntity } from '../../../infrastructure/persistence/entities/room.entity';
import { StaffEntity } from '../../../infrastructure/persistence/entities/staff.entity';
import { PaymentEntity } from '../../../infrastructure/persistence/entities/payment.entity';

export class CheckOutModel {
  CheckoutId: number;
  CheckoutDate: Date;
  CheckinId: number;
  RoomId: number;
  StaffId: number;

  checkIn?: CheckInEntity;
  room?: RoomEntity;
  staff?: StaffEntity;
  payments?: PaymentEntity[];

  constructor(params?: Partial<CheckOutModel>) {
    if (params) {
      Object.assign(this, params);
    }
  }
}