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
    const queryBuilder = this.roomRepository.createQueryBuilder('room');
    
    // Apply select
    if (query.select && query.select.length > 0) {
      queryBuilder.select(query.select.map(field => `room.${field}`));
    }
    
    // Apply relations
    if (query.relations && query.relations.length > 0) {
      query.relations.forEach(relation => {
        queryBuilder.leftJoinAndSelect(`room.${relation}`, relation);
      });
    }
    
    // Apply filters
    if (query.filter) {
      Object.keys(query.filter).forEach(key => {
        queryBuilder.andWhere(`room.${key} = :${key}`, { [key]: query.filter[key] });
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
    const entity = await this.roomRepository.findOne({
      where: { RoomId: id },
      relations: relations
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async findAvailableRooms(checkInDate: Date, checkOutDate: Date): Promise<RoomModel[]> {
    const entities = await this.roomRepository
      .createQueryBuilder('room')
      .where('room.RoomStatus = :status', { status: 'Available' })
      .andWhere('room.RoomId NOT IN ' +
        '(SELECT DISTINCT "RoomId" FROM bookings ' +
        'WHERE ("CheckinDate" <= :checkOutDate AND "CheckoutDate" >= :checkInDate))',
        { checkInDate, checkOutDate })
      .getMany();
    
    return entities.map(entity => this.mapToModel(entity));
  }

  async create(data: CreateRoomDto): Promise<RoomModel> {
    const entity = this.roomRepository.create(data);
    
    const savedEntity = await this.roomRepository.save(entity);
    return this.mapToModel(savedEntity);
  }

  async update(id: number, data: UpdateRoomDto): Promise<RoomModel> {
    const entity = await this.roomRepository.findOne({
      where: { RoomId: id },
    });
    
    if (!entity) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    
    Object.assign(entity, data);
    
    const updatedEntity = await this.roomRepository.save(entity);
    return this.mapToModel(updatedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.roomRepository.delete(id);
    return result.affected > 0;
  }

  private mapToModel(entity: RoomEntity): RoomModel {
    return new RoomModel({
      RoomId: entity.RoomId,
      RoomType: entity.RoomType,
      RoomStatus: entity.RoomStatus,
      RoomPrice: entity.RoomPrice,
      bookings: entity.bookings,
      checkIns: entity.checkIns,
      checkOuts: entity.checkOuts
    });
  }
}