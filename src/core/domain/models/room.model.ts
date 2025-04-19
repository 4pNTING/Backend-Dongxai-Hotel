// src/core/domain/models/room.model.ts
export class RoomModel {
  RoomId: number;
  RoomType: string;
  RoomStatus: string;
  RoomPrice: number;

  bookings?: any[];
  checkIns?: any[];
  checkOuts?: any[];

  constructor(params?: Partial<RoomModel>) {
    if (params) {
      Object.assign(this, params);
    }
  }
}