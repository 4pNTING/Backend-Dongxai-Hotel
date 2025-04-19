import { Inject, Injectable } from '@nestjs/common';
import { QueryDto } from '../common/query.dto';
import { RoomServicePort } from '../ports/room.port';
import { RoomModel } from '../../core/domain/models/room.model';
import { CreateRoomDto, UpdateRoomDto } from '../dtos/room.dto';

@Injectable()
export class RoomUseCase {
  constructor(
    @Inject('RoomServicePort')
    private readonly service: RoomServicePort
  ) {}

  async query(dto: QueryDto): Promise<RoomModel | RoomModel[]> {
    return this.service.query(dto);
  }

  async create(dto: CreateRoomDto): Promise<RoomModel> {
    return this.service.create(dto);
  }

  async update(id: number, dto: UpdateRoomDto): Promise<boolean> {
    return this.service.update(id, dto);
  }

  async delete(id: number): Promise<boolean> {
    return this.service.delete(id);
  }
}