// src/application/services/room.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { RoomRepository } from '../../infrastructure/persistence/repositories/room.repository';
import { QueryDto } from '../common/query.dto';
import { RoomModel } from '../../core/domain/models/room.model';
import { CreateRoomDto, UpdateRoomDto } from '../dtos/room.dto';
import { RoomServicePort } from '../ports/room.port';

@Injectable()
export class RoomService implements RoomServicePort {
  constructor(private roomRepository: RoomRepository) {}

  async query(dto: QueryDto): Promise<RoomModel | RoomModel[]> {
    if (dto.getType === 'one' && dto.filter && dto.filter.id) {
      const room = await this.roomRepository.findById(dto.filter.id);
      if (!room) {
        throw new NotFoundException(`Room with ID ${dto.filter.id} not found`);
      }
      return room;
    }
    return this.roomRepository.findAll(dto);
  }

  async create(dto: CreateRoomDto): Promise<RoomModel> {
    return this.roomRepository.create(dto);
  }

  async update(id: number, dto: UpdateRoomDto): Promise<boolean> {
    const room = await this.roomRepository.findById(id);
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    await this.roomRepository.update(id, dto);
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const room = await this.roomRepository.findById(id);
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return this.roomRepository.delete(id);
  }
}