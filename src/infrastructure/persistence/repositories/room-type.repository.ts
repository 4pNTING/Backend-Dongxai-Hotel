// src/infrastructure/persistence/repositories/room-type.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomTypeEntity } from '../entities/room-type.entity';
import { RoomTypeModel } from '../../../core/domain/models/room-type.model';
import { QueryDto } from '../../../application/common/query.dto';
import { CreateRoomTypeDto, UpdateRoomTypeDto } from '../../../application/dtos/room-type.dto';

@Injectable()
export class RoomTypeRepository {
  constructor(
    @InjectRepository(RoomTypeEntity)
    private readonly roomTypeRepository: Repository<RoomTypeEntity>,
  ) {}

  async findAll(query: QueryDto): Promise<RoomTypeModel[]> {
    const queryBuilder = this.roomTypeRepository.createQueryBuilder('roomType');
    

    const entities = await queryBuilder.getMany();
    return entities.map(entity => this.mapToModel(entity));
  }

  async findById(id: number): Promise<RoomTypeModel | null> {
    const entity = await this.roomTypeRepository.findOne({
      where: { TypeId: id }
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async findByName(typeName: string): Promise<RoomTypeModel | null> {
    const entity = await this.roomTypeRepository.findOne({
      where: { TypeName: typeName }
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async create(data: CreateRoomTypeDto): Promise<RoomTypeModel> {
    const entity = this.roomTypeRepository.create({
      TypeName: data.TypeName
    });
    
    const savedEntity = await this.roomTypeRepository.save(entity);
    return this.mapToModel(savedEntity);
  }

  async update(id: number, data: UpdateRoomTypeDto): Promise<RoomTypeModel> {
    const entity = await this.roomTypeRepository.findOne({
      where: { TypeId: id }
    });
    
    if (!entity) {
      throw new NotFoundException(`Room Type with id ${id} not found`);
    }
    
    entity.TypeName = data.TypeName;
    
    const updatedEntity = await this.roomTypeRepository.save(entity);
    return this.mapToModel(updatedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.roomTypeRepository.delete(id);
    return result.affected > 0;
  }

  private mapToModel(entity: RoomTypeEntity): RoomTypeModel {
    const model = new RoomTypeModel();
    model.TypeId = entity.TypeId;
    model.TypeName = entity.TypeName;
    return model;
  }
}