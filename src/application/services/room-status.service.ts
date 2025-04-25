// src/application/services/room-status.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { RoomStatusRepository } from '../../infrastructure/persistence/repositories/room-status.repository';
import { QueryDto } from '../common/query.dto';
import { RoomStatusModel } from '../../core/domain/models/room-status.model';
import { CreateRoomStatusDto, UpdateRoomStatusDto } from '../dtos/room-status.dto';
import { RoomStatusServicePort } from '../ports/room-status.port';

@Injectable()
export class RoomStatusService implements RoomStatusServicePort {
  constructor(private roomStatusRepository: RoomStatusRepository) {}

  async query(dto: QueryDto): Promise<RoomStatusModel | RoomStatusModel[]> {
    if (dto.getType === 'one' && dto.filter && dto.filter.id) {
      const status = await this.roomStatusRepository.findById(dto.filter.id);
      if (!status) {
        throw new NotFoundException(`Room status with ID ${dto.filter.id} not found`);
      }
      return status;
    }
    return this.roomStatusRepository.findAll(dto);
  }

  async create(dto: CreateRoomStatusDto): Promise<RoomStatusModel> {
    // สร้าง entity สำหรับ create
    const entity = {
      StatusName: dto.StatusName
    };
    
    // ต้องเพิ่มเมทอด create ใน repository
    // ซึ่งยังไม่มีในโค้ดที่คุณแสดง
    return this.roomStatusRepository.create(entity);
  }

  async update(id: number, dto: UpdateRoomStatusDto): Promise<boolean> {
    const status = await this.roomStatusRepository.findById(id);
    if (!status) {
      throw new NotFoundException(`Room status with ID ${id} not found`);
    }
    
    // ต้องเพิ่มเมทอด update ใน repository
    // ซึ่งยังไม่มีในโค้ดที่คุณแสดง
    return this.roomStatusRepository.update(id, dto);
  }

  async delete(id: number): Promise<boolean> {
    const status = await this.roomStatusRepository.findById(id);
    if (!status) {
      throw new NotFoundException(`Room status with ID ${id} not found`);
    }
    
    // ต้องเพิ่มเมทอด delete ใน repository
    // ซึ่งยังไม่มีในโค้ดที่คุณแสดง
    return this.roomStatusRepository.delete(id);
  }

  async findByName(name: string): Promise<RoomStatusModel | null> {
    return this.roomStatusRepository.findByName(name);
  }
}