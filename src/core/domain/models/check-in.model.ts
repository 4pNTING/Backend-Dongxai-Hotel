// src/core/domain/models/check-in.model.ts
export class CheckInModel {
  CheckInId: number; // ใช้ CheckInId ใน Model (business layer)
  CheckInDate: Date; // ใช้ CheckInDate ใน Model
  CheckoutDate: Date;
  RoomId: number;
  BookingId: number;
  CustomerId: number; // ใช้ CustomerId ใน Model (business layer)
  StaffId: number;
  
  // Relations
  booking?: any;
  room?: any;
  customer?: any;
  staff?: any;
  checkOuts?: any[];

  constructor(data: Partial<CheckInModel>) {
    Object.assign(this, data);
  }
}