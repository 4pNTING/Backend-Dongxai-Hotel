import { Injectable, NotFoundException } from '@nestjs/common';
import { CancellationRepository } from '../../infrastructure/persistence/repositories/cancellation.repository';
import { QueryDto } from '../common/query.dto';
import { CancellationModel } from '../../core/domain/models/cancellation.model';
import { CreateCancellationDto, UpdateCancellationDto } from '../dtos/cancellation.dto';

@Injectable()
export class CancellationService {
  constructor(private cancellationRepository: CancellationRepository) {}

  async query(dto: QueryDto): Promise<CancellationModel | CancellationModel[]> {
    if (dto.getType === 'one' && dto.filter && dto.filter.id) {
      const cancellation = await this.cancellationRepository.findById(dto.filter.id);
      if (!cancellation) {
        throw new NotFoundException(`Cancellation with ID ${dto.filter.id} not found`);
      }
      return cancellation;
    }
    return this.cancellationRepository.findAll(dto);
  }

  async findByBookingId(bookingId: number): Promise<CancellationModel | null> {
    return this.cancellationRepository.findByBookingId(bookingId);
  }

  async create(dto: CreateCancellationDto): Promise<CancellationModel> {
    return this.cancellationRepository.create(dto);
  }

  async update(id: number, dto: UpdateCancellationDto): Promise<boolean> {
    const cancellation = await this.cancellationRepository.findById(id);
    if (!cancellation) {
      throw new NotFoundException(`Cancellation with ID ${id} not found`);
    }
    
    await this.cancellationRepository.update(id, dto);
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const cancellation = await this.cancellationRepository.findById(id);
    if (!cancellation) {
      throw new NotFoundException(`Cancellation with ID ${id} not found`);
    }
    return this.cancellationRepository.delete(id);
  }
}