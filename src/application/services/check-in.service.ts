// src/core/services/check-in.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CheckInRepository } from '../../infrastructure/persistence/repositories/check-in.repository';
import { QueryDto } from '../../application/common/query.dto';
import { CheckInModel } from '../../core/domain/models/check-in.model';
import { CreateCheckInDto, UpdateCheckInDto } from '../../application/dtos/check-in.dto';

@Injectable()
export class CheckInService {
  constructor(private checkInRepository: CheckInRepository) {}

  async query(dto: QueryDto): Promise<CheckInModel | CheckInModel[]> {
    if (dto.getType === 'one' && dto.filter && dto.filter.id) {
      const checkIn = await this.checkInRepository.findById(dto.filter.id);
      if (!checkIn) {
        throw new NotFoundException(`Check-in with ID ${dto.filter.id} not found`);
      }
      return checkIn;
    }
    return this.checkInRepository.findAll(dto);
  }

  async findByCustomerId(customerId: number): Promise<CheckInModel[]> {
    return this.checkInRepository.findByCustomerId(customerId);
  }

  async create(dto: CreateCheckInDto): Promise<CheckInModel> {
    return this.checkInRepository.create(dto);
  }

  async update(id: number, dto: UpdateCheckInDto): Promise<boolean> {
    const checkIn = await this.checkInRepository.findById(id);
    if (!checkIn) {
      throw new NotFoundException(`Check-in with ID ${id} not found`);
    }
    await this.checkInRepository.update(id, dto);
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const checkIn = await this.checkInRepository.findById(id);
    if (!checkIn) {
      throw new NotFoundException(`Check-in with ID ${id} not found`);
    }
    return this.checkInRepository.delete(id);
  }
}