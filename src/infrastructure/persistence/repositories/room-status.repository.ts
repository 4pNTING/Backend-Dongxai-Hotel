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

  async create(data: { StatusName: string }): Promise<RoomStatusModel> {
    const entity = this.roomStatusRepository.create(data);
    const saved = await this.roomStatusRepository.save(entity);
    return this.mapToModel(saved);
  }
  
  async update(id: number, data: Partial<{ StatusName: string }>): Promise<boolean> {
    const result = await this.roomStatusRepository.update({ StatusId: id }, data);
    return result.affected > 0;
  }
  
  async delete(id: number): Promise<boolean> {
    const result = await this.roomStatusRepository.delete({ StatusId: id });
    return result.affected > 0;
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