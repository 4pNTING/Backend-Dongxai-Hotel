// src/application/ports/room.port.ts
import { QueryDto } from '../common/query.dto';
import { RoomModel } from '../../core/domain/models/room.model';
import { CreateRoomDto, UpdateRoomDto } from '../dtos/room.dto';

export interface RoomServicePort {
  query(dto: QueryDto): Promise<RoomModel | RoomModel[]>;
  create(dto: CreateRoomDto): Promise<RoomModel>;
  update(id: number, dto: UpdateRoomDto): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}