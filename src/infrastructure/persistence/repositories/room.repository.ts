import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../entities/room.entity';
import { RoomTypeEntity } from '../entities/room-type.entity';
import { RoomStatusEntity } from '../entities/room-status.entity';
import { RoomModel } from '../../../core/domain/models/room.model';
import { QueryDto } from '../../../application/common/query.dto';
import { CreateRoomDto, UpdateRoomDto } from '../../../application/dtos/room.dto';
import { RoomMapper } from '../../mappers/room.mapper';

@Injectable()
export class RoomRepository {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(RoomTypeEntity)
    private readonly roomTypeRepository: Repository<RoomTypeEntity>,
    @InjectRepository(RoomStatusEntity)
    private readonly roomStatusRepository: Repository<RoomStatusEntity>
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
    return RoomMapper.toModelList(entities);
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
    
    return RoomMapper.toModel(entity);
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
    
    return RoomMapper.toModelList(entities);
  }

  async create(data: CreateRoomDto): Promise<RoomModel> {
    // ใช้ mapper เพื่อแปลง DTO เป็นข้อมูลสำหรับสร้าง entity
    const entityData = RoomMapper.toEntity(data);
    const entity = this.roomRepository.create(entityData);
    
    const savedEntity = await this.roomRepository.save(entity);
    return this.findById(savedEntity.RoomId); // Fetch with relations
  }

  async update(id: number, data: UpdateRoomDto): Promise<RoomModel> {
    // Validate room type if provided
    if (data.TypeId !== undefined) {
      const roomType = await this.roomTypeRepository.findOne({ 
        where: { TypeId: data.TypeId } 
      });
      if (!roomType) {
        throw new NotFoundException(`Room type with ID ${data.TypeId} not found`);
      }
    }
  
    // Validate room status if provided
    if (data.StatusId !== undefined) {
      const roomStatus = await this.roomStatusRepository.findOne({ 
        where: { StatusId: data.StatusId } 
      });
      if (!roomStatus) {
        throw new NotFoundException(`Room status with ID ${data.StatusId} not found`);
      }
    }
  
    // Find the room
    const entity = await this.roomRepository.findOne({
      where: { RoomId: id },
      relations: ['roomType', 'roomStatus'] // Explicitly load relations
    });
    
    if (!entity) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    
    // Update only the fields that are provided
    if (data.TypeId !== undefined) {
      entity.TypeId = data.TypeId;
      // Optional: Update roomType reference
      entity.roomType = { TypeId: data.TypeId } as RoomTypeEntity;
    }
    if (data.StatusId !== undefined) {
      entity.StatusId = data.StatusId;
      // Optional: Update roomStatus reference
      entity.roomStatus = { StatusId: data.StatusId } as RoomStatusEntity;
    }
    if (data.RoomPrice !== undefined) {
      entity.RoomPrice = data.RoomPrice;
    }
  
    // Save with additional options
    await this.roomRepository.save(entity, {
      reload: true // Ensures the latest data is reloaded
    });
  
    // ดึงข้อมูลล่าสุดและคืนค่า
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.roomRepository.delete(id);
    return result.affected > 0;
  }
}