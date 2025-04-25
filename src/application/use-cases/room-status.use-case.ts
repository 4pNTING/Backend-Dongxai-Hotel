// src/application/use-cases/room-status.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { QueryDto } from '../common/query.dto';
import { RoomStatusServicePort } from '../ports/room-status.port';
import { RoomStatusModel } from '../../core/domain/models/room-status.model';
import { CreateRoomStatusDto, UpdateRoomStatusDto } from '../dtos/room-status.dto';

@Injectable()
export class RoomStatusUseCase {
  constructor(
    @Inject('RoomStatusServicePort')
    private readonly service: RoomStatusServicePort
  ) {}

  async query(dto: QueryDto): Promise<RoomStatusModel | RoomStatusModel[]> {
    return this.service.query(dto);
  }

  async create(dto: CreateRoomStatusDto): Promise<RoomStatusModel> {
    return this.service.create(dto);
  }

  async update(id: number, dto: UpdateRoomStatusDto): Promise<boolean> {
    return this.service.update(id, dto);
  }

  async delete(id: number): Promise<boolean> {
    return this.service.delete(id);
  }

  async findByName(name: string): Promise<RoomStatusModel | null> {
    return this.service.findByName(name);
  }
}