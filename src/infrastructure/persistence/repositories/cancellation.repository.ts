// src/infrastructure/persistence/repositories/cancellation.repository.ts (อัปเดต)
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CancellationEntity } from '../entities/cancellation.entity';
import { CancellationModel } from '../../../core/domain/models/cancellation.model';
import { QueryDto } from '../../../application/common/query.dto';
import { CreateCancellationDto, UpdateCancellationDto } from '../../../application/dtos/cancellation.dto';
import { QueryBuilderService } from '../../../../src/infrastructure/services/query-builder.service';

@Injectable()
export class CancellationRepository {
  constructor(
    @InjectRepository(CancellationEntity)
    private readonly cancellationRepository: Repository<CancellationEntity>,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async findAll(query: QueryDto): Promise<CancellationModel[]> {
    const queryBuilder = this.cancellationRepository.createQueryBuilder('cancellation');
    
 
    this.queryBuilderService.applyBasicQuery(queryBuilder, query, 'cancellation');
    
 
    if (!query.orderBy && !query.orderByField) {
      queryBuilder.orderBy('cancellation.CancelDate', 'DESC');
    }
    
    const entities = await queryBuilder.getMany();
    return entities.map(entity => this.mapToModel(entity));
  }

  async findById(id: number, relations: string[] = []): Promise<CancellationModel | null> {
    const entity = await this.cancellationRepository.findOne({
      where: { CancelId: id },
      relations: relations
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async findByBookingId(bookingId: number): Promise<CancellationModel | null> {
    const entity = await this.cancellationRepository.findOne({
      where: { BookingId: bookingId },
      relations: ['booking', 'staff']
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async create(data: CreateCancellationDto): Promise<CancellationModel> {
    const entity = this.cancellationRepository.create(data);
    
    const savedEntity = await this.cancellationRepository.save(entity);
    return this.mapToModel(savedEntity);
  }

  async update(id: number, data: UpdateCancellationDto): Promise<CancellationModel> {
    const entity = await this.cancellationRepository.findOne({
      where: { CancelId: id }
    });
    
    if (!entity) {
      throw new NotFoundException(`Cancellation with id ${id} not found`);
    }
    
    Object.assign(entity, data);
    
    const updatedEntity = await this.cancellationRepository.save(entity);
    return this.mapToModel(updatedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.cancellationRepository.delete(id);
    return result.affected > 0;
  }

  private mapToModel(entity: CancellationEntity): CancellationModel {
    const model = new CancellationModel();
    
    model.CancelId = entity.CancelId;
    model.CancelDate = entity.CancelDate;
    model.StaffId = entity.StaffId;
    model.BookingId = entity.BookingId;
    
    // Add related entities if they exist
    if (entity.booking) model.booking = entity.booking;
    if (entity.staff) model.staff = entity.staff;
    
    return model;
  }
}