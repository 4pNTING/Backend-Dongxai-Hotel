// src/application/use-cases/room-type.use-case.ts
import { Injectable } from '@nestjs/common';
import { RoomTypeRepository } from '../../infrastructure/persistence/repositories/room-type.repository';
import { CreateRoomTypeDto, UpdateRoomTypeDto } from '../dtos/room-type.dto';
import { RoomTypeModel } from '../../core/domain/models/room-type.model';
import { QueryDto } from '../common/query.dto';

@Injectable()
export class RoomTypeUseCase {
  constructor(
    private readonly roomTypeRepository: RoomTypeRepository
  ) {}

  async create(createRoomTypeDto: CreateRoomTypeDto): Promise<RoomTypeModel> {
    return this.roomTypeRepository.create(createRoomTypeDto);
  }

  async update(id: number, updateRoomTypeDto: UpdateRoomTypeDto): Promise<RoomTypeModel> {
    return this.roomTypeRepository.update(id, updateRoomTypeDto);
  }

  async delete(id: number): Promise<boolean> {
    return this.roomTypeRepository.delete(id);
  }

  async query(queryDto: QueryDto): Promise<RoomTypeModel | RoomTypeModel[] | { items: RoomTypeModel[], totalCount: number }> {
    const { getType, ...rest } = queryDto;
    
  
    
    return this.roomTypeRepository.findAll(rest);
  }
}