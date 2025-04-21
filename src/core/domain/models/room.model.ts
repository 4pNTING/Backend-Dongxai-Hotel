// src/core/domain/models/room.model.ts
import { RoomTypeModel } from './room-type.model';
import { RoomStatusModel } from './room-status.model';

export class RoomModel {
  RoomId: number;
  TypeId: number;
  StatusId: number;
  RoomPrice: number;
  
  roomType?: RoomTypeModel;
  roomStatus?: RoomStatusModel;
  
  bookings?: any[];
  checkIns?: any[];
  checkOuts?: any[];
}