// src/application/ports/room-status.port.ts
import { QueryDto } from '../common/query.dto';
import { RoomStatusModel } from '../../core/domain/models/room-status.model';
import { CreateRoomStatusDto, UpdateRoomStatusDto } from '../dtos/room-status.dto';

export interface RoomStatusServicePort {
  query(dto: QueryDto): Promise<RoomStatusModel | RoomStatusModel[]>;
  create(dto: CreateRoomStatusDto): Promise<RoomStatusModel>;
  update(id: number, dto: UpdateRoomStatusDto): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  findByName(name: string): Promise<RoomStatusModel | null>;
}