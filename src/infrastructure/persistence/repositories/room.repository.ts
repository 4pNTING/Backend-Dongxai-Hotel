// src/infrastructure/persistence/repositories/room.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../entities/room.entity';
import { RoomModel } from '../../../core/domain/models/room.model';
import { QueryDto } from '../../../application/common/query.dto';
import { CreateRoomDto, UpdateRoomDto } from '../../../application/dtos/room.dto';

@Injectable()
export class RoomRepository {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async findAll(query: QueryDto): Promise<RoomModel[]> {
    const queryBuilder = this.roomRepository.createQueryBuilder('room')
      .leftJoinAndSelect('room.roomType', 'roomType')
      .leftJoinAndSelect('room.roomStatus', 'roomStatus');
    
    // Apply select
    if (query.select && query.select.length > 0) {
      queryBuilder.select(query.select.map(field => `room.${field}`));
    }
    
    // Apply relations
    if (query.relations && query.relations.length > 0) {
      query.relations.forEach(relation => {
        if (relation !== 'roomType' && relation !== 'roomStatus') { // These are already joined
          queryBuilder.leftJoinAndSelect(`room.${relation}`, relation);
        }
      });
    }
    
    // Apply filters
    if (query.filter) {
      Object.keys(query.filter).forEach(key => {
        if (key === 'RoomType') {
          queryBuilder.andWhere('roomType.TypeName = :typeName', { typeName: query.filter[key] });
        } else if (key === 'RoomStatus') {
          queryBuilder.andWhere('roomStatus.StatusName = :statusName', { statusName: query.filter[key] });
        } else {
          queryBuilder.andWhere(`room.${key} = :${key}`, { [key]: query.filter[key] });
        }
      });
    }
    
    // Apply sorting
    if (query.orderBy) {
      Object.keys(query.orderBy).forEach(key => {
        queryBuilder.addOrderBy(`room.${key}`, query.orderBy[key]);
      });
    } else if (query.orderByField) {
      queryBuilder.orderBy(`room.${query.orderByField}`, query.order);
    } else {
      queryBuilder.orderBy('room.RoomId', 'ASC');
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

  async findById(id: number, relations: string[] = []): Promise<RoomModel | null> {
    // Always include roomType and roomStatus
    const allRelations = [...new Set(['roomType', 'roomStatus', ...relations])];
    
    const entity = await this.roomRepository.findOne({
      where: { RoomId: id },
      relations: allRelations
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async findAvailableRooms(checkInDate: Date, checkOutDate: Date): Promise<RoomModel[]> {
    const availableStatusId = 1; // Assuming 1 is the ID for 'Available' status
    
    const entities = await this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.roomType', 'roomType')
      .leftJoinAndSelect('room.roomStatus', 'roomStatus')
      .where('room.StatusId = :statusId', { statusId: availableStatusId })
      .andWhere('room.RoomId NOT IN ' +
        '(SELECT DISTINCT "RoomId" FROM bookings ' +
        'WHERE ("CheckinDate" <= :checkOutDate AND "CheckoutDate" >= :checkInDate))',
        { checkInDate, checkOutDate })
      .getMany();
    
    return entities.map(entity => this.mapToModel(entity));
  }

  async create(data: CreateRoomDto): Promise<RoomModel> {
    const entity = this.roomRepository.create({
      TypeId: data.TypeId,
      StatusId: data.StatusId,
      RoomPrice: data.RoomPrice
    });
    
    const savedEntity = await this.roomRepository.save(entity);
    return this.findById(savedEntity.RoomId); // Fetch with relations
  }

  async update(id: number, data: UpdateRoomDto): Promise<RoomModel> {
    const entity = await this.roomRepository.findOne({
      where: { RoomId: id },
    });
    
    if (!entity) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    
    // Update only the fields that are provided
    if (data.TypeId !== undefined) entity.TypeId = data.TypeId;
    if (data.StatusId !== undefined) entity.StatusId = data.StatusId;
    if (data.RoomPrice !== undefined) entity.RoomPrice = data.RoomPrice;
    
    await this.roomRepository.save(entity);
    return this.findById(id); // Fetch with relations
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.roomRepository.delete(id);
    return result.affected > 0;
  }

  private mapToModel(entity: RoomEntity): RoomModel {
    const model = new RoomModel();
    model.RoomId = entity.RoomId;
    model.TypeId = entity.TypeId;
    model.StatusId = entity.StatusId;
    model.RoomPrice = entity.RoomPrice;
    
    // Map related entities if available
    if (entity.roomType) {
      model.roomType = {
        TypeId: entity.roomType.TypeId,
        TypeName: entity.roomType.TypeName
      };
    }
    
    if (entity.roomStatus) {
      model.roomStatus = {
        StatusId: entity.roomStatus.StatusId,
        StatusName: entity.roomStatus.StatusName
      };
    }
    
    model.bookings = entity.bookings;
    model.checkIns = entity.checkIns;
    model.checkOuts = entity.checkOuts;
    
    return model;
  }
}