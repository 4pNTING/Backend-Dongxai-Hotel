
import { RoomTypeModel } from './room-type.model';
import { RoomStatusModel } from './room-status.model';

export class RoomModel {
  RoomId: number;
  TypeId: number;
  StatusId: number;
  RoomPrice: number;

  // Relations
  roomType?: {
    TypeId: number;
    TypeName: string;
  };
  roomStatus?: {
    StatusId: number;
    StatusName: string;
  };
  bookings?: any[];
  checkIns?: any[];
  checkOuts?: any[];
}