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
  CustomerId: number;
  StaffId: number;
  BookingStatus: string;
  CreatedAt: Date;
  
  // Relations
  room?: any;
  customer?: any;
  staff?: any;
  checkIns?: any[];
  cancellations?: any[];
}