// src/core/services/room-type.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { RoomTypeRepository } from '../../infrastructure/persistence/repositories/room-type.repository';
import { RoomTypeModel } from '../../core/domain/models/room-type.model';
import { CreateRoomTypeDto, UpdateRoomTypeDto } from '../../application/dtos/room-type.dto';
import { QueryDto } from '../../application/common/query.dto';

@Injectable()
export class RoomTypeService {
  constructor(
    private readonly roomTypeRepository: RoomTypeRepository
  ) {}

  async getAllRoomTypes(query?: QueryDto): Promise<RoomTypeModel[]> {
    return this.roomTypeRepository.findAll(query);
  }

  async getRoomTypeById(id: number): Promise<RoomTypeModel> {
    const roomType = await this.roomTypeRepository.findById(id);
    if (!roomType) {
      throw new NotFoundException(`Room Type with ID ${id} not found`);
    }
    return roomType;
  }

  async createRoomType(data: CreateRoomTypeDto): Promise<RoomTypeModel> {
    // Check if room type with same name already exists
    const existingRoomType = await this.roomTypeRepository.findByName(data.TypeName);
    if (existingRoomType) {
      throw new ConflictException(`Room Type with name ${data.TypeName} already exists`);
    }

    return this.roomTypeRepository.create(data);
  }

  async updateRoomType(id: number, data: UpdateRoomTypeDto): Promise<RoomTypeModel> {
    // Ensure room type exists
    await this.getRoomTypeById(id);

    // Check if new name conflicts with existing room types
    if (data.TypeName) {
      const existingRoomType = await this.roomTypeRepository.findByName(data.TypeName);
      if (existingRoomType && existingRoomType.TypeId !== id) {
        throw new ConflictException(`Room Type with name ${data.TypeName} already exists`);
      }
    }

    return this.roomTypeRepository.update(id, data);
  }

  async deleteRoomType(id: number): Promise<boolean> {
    // Ensure room type exists before deleting
    await this.getRoomTypeById(id);

    return this.roomTypeRepository.delete(id);
  }
}