// src/infrastructure/persistence/repositories/room-status.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomStatusEntity } from '../entities/room-status.entity';
import { RoomStatusModel } from '../../../core/domain/models/room-status.model';
import { QueryDto } from '../../../application/common/query.dto';

@Injectable()
export class RoomStatusRepository {
  constructor(
    @InjectRepository(RoomStatusEntity)
    private readonly roomStatusRepository: Repository<RoomStatusEntity>,
  ) {}

  async findAll(query: QueryDto): Promise<RoomStatusModel[]> {
    const queryBuilder = this.roomStatusRepository.createQueryBuilder('roomStatus');
    
    // Apply select
    if (query.select && query.select.length > 0) {
      queryBuilder.select(query.select.map(field => `roomStatus.${field}`));
    }
    
    // Apply filters
    if (query.filter) {
      Object.keys(query.filter).forEach(key => {
        queryBuilder.andWhere(`roomStatus.${key} = :${key}`, { [key]: query.filter[key] });
      });
    }
    
    // Apply sorting
    if (query.orderBy) {
      Object.keys(query.orderBy).forEach(key => {
        queryBuilder.addOrderBy(`roomStatus.${key}`, query.orderBy[key]);
      });
    } else if (query.orderByField) {
      queryBuilder.orderBy(`roomStatus.${query.orderByField}`, query.order);
    } else {
      queryBuilder.orderBy('roomStatus.StatusId', 'ASC');
    }
    
    // Apply pagination
    if (query.skip !== undefined) {
      queryBuilder.skip(query.skip);
    }
    
    if (query.take !== undefined) {
      queryBuilder.take(query.take);
    }
    
    const entities = await queryBuilder.getMany();
    return entities.map(entity => this.mapToModel(entity));
  }

  async findById(id: number): Promise<RoomStatusModel | null> {
    const entity = await this.roomStatusRepository.findOne({
      where: { StatusId: id }
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async findByName(statusName: string): Promise<RoomStatusModel | null> {
    const entity = await this.roomStatusRepository.findOne({
      where: { StatusName: statusName }
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  private mapToModel(entity: RoomStatusEntity): RoomStatusModel {
    const model = new RoomStatusModel();
    model.StatusId = entity.StatusId;
    model.StatusName = entity.StatusName;
    return model;
  }
}