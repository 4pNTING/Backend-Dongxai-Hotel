import { Injectable, NotFoundException } from '@nestjs/common';
import { CheckOutRepository } from '../../infrastructure/persistence/repositories/check-out.repository';
import { QueryDto } from '../common/query.dto';
import { CheckOutModel } from '../../core/domain/models/check-out.model';
import { CreateCheckOutDto, UpdateCheckOutDto } from '../dtos/check-out.dto';

@Injectable()
export class CheckOutService {
  constructor(private checkOutRepository: CheckOutRepository) {}

  async query(dto: QueryDto): Promise<CheckOutModel | CheckOutModel[]> {
    if (dto.getType === 'one' && dto.filter && dto.filter.id) {
      const checkOut = await this.checkOutRepository.findById(dto.filter.id);
      if (!checkOut) {
        throw new NotFoundException(`Check-out with ID ${dto.filter.id} not found`);
      }
      return checkOut;
    }
    return this.checkOutRepository.findAll(dto);
  }

  async findByCheckInId(checkInId: number): Promise<CheckOutModel | null> {
    return this.checkOutRepository.findByCheckInId(checkInId);
  }

  async create(dto: CreateCheckOutDto): Promise<CheckOutModel> {
    return this.checkOutRepository.create(dto);
  }

  async update(id: number, dto: UpdateCheckOutDto): Promise<boolean> {
    const checkOut = await this.checkOutRepository.findById(id);
    if (!checkOut) {
      throw new NotFoundException(`Check-out with ID ${id} not found`);
    }
    
    await this.checkOutRepository.update(id, dto);
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const checkOut = await this.checkOutRepository.findById(id);
    if (!checkOut) {
      throw new NotFoundException(`Check-out with ID ${id} not found`);
    }
    return this.checkOutRepository.delete(id);
  }
}