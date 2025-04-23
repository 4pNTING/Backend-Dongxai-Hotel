// src/core/domain/models/check-in.model.ts
import { BookingEntity } from '../../../infrastructure/persistence/entities/booking.entity';
import { RoomEntity } from '../../../infrastructure/persistence/entities/room.entity';
import { CustomerEntity } from '../../../infrastructure/persistence/entities/customer.entity';
import { StaffEntity } from '../../../infrastructure/persistence/entities/staff.entity';
import { CheckOutEntity } from '@infrastructure/persistence/entities/check-out.entity';

export class CheckInModel {
  CheckInId: number; // แก้จาก CheckinId เป็น CheckInId
  CheckInDate: Date; // แก้จาก CheckinDate เป็น CheckInDate
  CheckoutDate: Date;
  RoomId: number;
  BookingId: number;
  CustomerId: number; // เปลี่ยนจาก GuestId เป็น CustomerId
  StaffId: number;
  checkOuts?: CheckOutEntity[];
  booking?: BookingEntity;
  room?: RoomEntity;
  customer?: CustomerEntity; // เปลี่ยนจาก guest เป็น customer
  staff?: StaffEntity;

  constructor(data: {
    CheckInId: number; // แก้จาก CheckinId เป็น CheckInId
    CheckInDate: Date; // แก้จาก CheckinDate เป็น CheckInDate
    CheckoutDate: Date;
    RoomId: number;
    BookingId: number;
    CustomerId: number; // เปลี่ยนจาก GuestId เป็น CustomerId
    StaffId: number;
    booking?: BookingEntity;
    room?: RoomEntity;
    customer?: CustomerEntity; // เปลี่ยนจาก guest เป็น customer
    staff?: StaffEntity;
    checkOuts?: CheckOutEntity[];
  }) {
    this.CheckInId = data.CheckInId;
    this.CheckInDate = data.CheckInDate;
    this.CheckoutDate = data.CheckoutDate;
    this.RoomId = data.RoomId;
    this.BookingId = data.BookingId;
    this.CustomerId = data.CustomerId;
    this.StaffId = data.StaffId;
    this.booking = data.booking;
    this.room = data.room;
    this.customer = data.customer;
    this.staff = data.staff;
    this.checkOuts = data.checkOuts;
  }
}