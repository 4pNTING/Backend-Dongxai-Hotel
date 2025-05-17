// src/core/domain/models/booking-status.model.ts
export class BookingStatusModel {
  StatusId: number;
  StatusName: string;
  Description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}