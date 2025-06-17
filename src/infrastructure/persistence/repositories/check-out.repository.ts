// src/infrastructure/persistence/repositories/check-out.repository.ts (อัปเดต)
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckOutEntity } from '../entities/check-out.entity';
import { CheckOutModel } from '../../../core/domain/models/check-out.model';
import { QueryDto } from '../../../application/common/query.dto';
import { CreateCheckOutDto, UpdateCheckOutDto } from '../../../application/dtos/check-out.dto';
import { QueryBuilderService } from '../../../../src/infrastructure/services/query-builder.service';

@Injectable()
export class CheckOutRepository {
  constructor(
    @InjectRepository(CheckOutEntity)
    private readonly checkOutRepository: Repository<CheckOutEntity>,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async findAll(query: QueryDto): Promise<CheckOutModel[]> {
    const queryBuilder = this.checkOutRepository.createQueryBuilder('checkOut');
    
    // Use QueryBuilderService for basic operations
    this.queryBuilderService.applyBasicQuery(queryBuilder, query, 'checkOut');
    
    // Default sorting if not specified
    if (!query.orderBy && !query.orderByField) {
      queryBuilder.orderBy('checkOut.CheckoutDate', 'DESC');
    }
    
    const entities = await queryBuilder.getMany();
    return entities.map(entity => this.mapToModel(entity));
  }

  async findById(id: number, relations: string[] = []): Promise<CheckOutModel | null> {
    const entity = await this.checkOutRepository.findOne({
      where: { CheckoutId: id },
      relations: relations
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async findByCheckInId(checkInId: number): Promise<CheckOutModel | null> {
    const entity = await this.checkOutRepository.findOne({
      where: { CheckInId: checkInId },
      relations: ['checkIn', 'room', 'staff']
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async create(data: CreateCheckOutDto): Promise<CheckOutModel> {
    const entity = this.checkOutRepository.create(data);
    const savedEntity = await this.checkOutRepository.save(entity);
    return this.mapToModel(savedEntity);
  }

  async update(id: number, data: UpdateCheckOutDto): Promise<CheckOutModel> {
    const entity = await this.checkOutRepository.findOne({
      where: { CheckoutId: id }
    });
    
    if (!entity) {
      throw new NotFoundException(`Check-out with id ${id} not found`);
    }
    
    Object.assign(entity, data);
    const updatedEntity = await this.checkOutRepository.save(entity);
    return this.mapToModel(updatedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.checkOutRepository.delete(id);
    return result.affected > 0;
  }

  private mapToModel(entity: CheckOutEntity): CheckOutModel {
    const model = new CheckOutModel();
    
    model.CheckoutId = entity.CheckoutId;
    model.CheckoutDate = entity.CheckoutDate;
    model.CheckinId = entity.CheckInId;
    model.RoomId = entity.RoomId;
    model.StaffId = entity.StaffId;
    model.checkIn = entity.checkIn;
    model.room = entity.room;
    model.staff = entity.staff;
    model.payments = entity.payments;
    
    return model;
  }
}