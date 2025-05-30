// src/infrastructure/persistence/repositories/booking.repository.ts
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity } from '../entities/booking.entity';
import { BookingModel } from '../../../core/domain/models/booking.model';
import { QueryDto } from '../../../application/common/query.dto';
import { CreateBookingDto, UpdateBookingDto } from '../../../application/dtos/booking.dto';

@Injectable()
export class BookingRepository {
  private readonly logger = new Logger(BookingRepository.name);

  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>
  ) { }

  async findAll(query: QueryDto): Promise<BookingModel[]> {
    this.logger.log(`Finding all bookings with query: ${JSON.stringify(query)}`);
    
    const queryBuilder = this.bookingRepository.createQueryBuilder('booking');

    // Apply relations
    if (query.relations && query.relations.length > 0) {
      const relationsArray = Array.isArray(query.relations) 
        ? query.relations 
        : typeof query.relations === 'string' 
          ? [query.relations] 
          : [];
      
      // Define safe relations to include
      const validRelations = ['room', 'customer', 'staff'];
      
      relationsArray.forEach(relation => {
        if (validRelations.includes(relation)) {
          queryBuilder.leftJoinAndSelect(`booking.${relation}`, relation);
          
          // If room is being joined, also join room's type and status
          if (relation === 'room') {
            queryBuilder.leftJoinAndSelect('room.roomType', 'roomType');
            queryBuilder.leftJoinAndSelect('room.roomStatus', 'roomStatus');
          }
          
          this.logger.debug(`Added relation: booking.${relation}`);
        }
      });
    } else {
      // Default join room with roomType and roomStatus
      queryBuilder.leftJoinAndSelect('booking.room', 'room');
      queryBuilder.leftJoinAndSelect('room.roomType', 'roomType');
      queryBuilder.leftJoinAndSelect('room.roomStatus', 'roomStatus');
      queryBuilder.leftJoinAndSelect('booking.customer', 'customer');
      queryBuilder.leftJoinAndSelect('booking.staff', 'staff');
    }

    // Join booking_statuses table manually
    queryBuilder.leftJoin('booking_statuses', 'bookingStatus', 'booking.StatusId = bookingStatus.StatusId');
    queryBuilder.addSelect([
      'bookingStatus.StatusId AS bookingStatus_StatusId',
      'bookingStatus.StatusName AS bookingStatus_StatusName'
    ]);

    // Apply filters
    if (query.filter && typeof query.filter === 'object') {
      Object.keys(query.filter).forEach(key => {
        // Handle basic booking fields
        const basicBookingFields = ['BookingId', 'CustomerId', 'RoomId', 'StaffId', 'StatusId', 'BookingDate', 'CheckinDate', 'CheckoutDate'];
        
        if (basicBookingFields.includes(key)) {
          queryBuilder.andWhere(`booking.${key} = :${key}`, { [key]: query.filter[key] });
        }
        // Handle BookingStatus filter
        else if (key === 'BookingStatus' || key === 'StatusName') {
          queryBuilder.andWhere('bookingStatus.StatusName = :bookingStatusName', { 
            bookingStatusName: query.filter[key] 
          });
        }
        // Handle RoomStatus filter
        else if (key === 'RoomStatus') {
          queryBuilder.andWhere('roomStatus.StatusName = :roomStatusName', { 
            roomStatusName: query.filter[key] 
          });
        }
        // Handle RoomType filter
        else if (key === 'RoomType') {
          queryBuilder.andWhere('roomType.TypeName = :roomTypeName', { 
            roomTypeName: query.filter[key] 
          });
        }
      });
    }

    // Apply search
    if (query.search) {
      queryBuilder.andWhere(
        '(booking.BookingId::text LIKE :search OR COALESCE(customer.CustomerName, \'\') LIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    // Apply sorting
    if (query.orderBy && typeof query.orderBy === 'object') {
      Object.keys(query.orderBy).forEach(key => {
        queryBuilder.addOrderBy(`booking.${key}`, query.orderBy[key]);
      });
    } else if (query.orderByField) {
      queryBuilder.orderBy(`booking.${query.orderByField}`, query.order);
    } else {
      queryBuilder.orderBy('booking.BookingDate', 'DESC');
    }

    // Apply pagination
    if (query.skip !== undefined) {
      queryBuilder.skip(query.skip);
    }

    if (query.take !== undefined) {
      queryBuilder.take(query.take);
    }

    // Log the SQL query for debugging
    this.logger.debug(`Generated SQL: ${queryBuilder.getSql()}`);
    this.logger.debug(`Parameters: ${JSON.stringify(queryBuilder.getParameters())}`);

    // Get results using getRawAndEntities to access both entity data and raw data
    const result = await queryBuilder.getRawAndEntities();
    this.logger.log(`Found ${result.entities.length} bookings`);
    
    // Map results
    return result.entities.map((entity, index) => {
      const rawData = result.raw[index];
      const model = new BookingModel();
      
      // Map basic booking properties
      model.BookingId = entity.BookingId;
      model.BookingDate = entity.BookingDate;
      model.RoomId = entity.RoomId;
      model.CheckinDate = entity.CheckinDate;
      model.CheckoutDate = entity.CheckoutDate;
      model.CustomerId = entity.CustomerId;
      model.StaffId = entity.StaffId;
      model.StatusId = entity.StatusId;
      model.CreatedAt = entity.CreatedAt;
      
      // Map relations with their nested objects
      if (entity.room) {
        model.room = {
          ...entity.room,
          roomType: entity.room.roomType || null,
          roomStatus: entity.room.roomStatus || null
        };
      }
      
      if (entity.customer) model.customer = entity.customer;
      if (entity.staff) model.staff = entity.staff;
      
      // Map BookingStatus from raw data
      if (rawData.bookingStatus_StatusId) {
        model.BookingStatus = {
          StatusId: rawData.bookingStatus_StatusId,
          StatusName: rawData.bookingStatus_StatusName
        };
      }
      
      // Map other related entities if loaded
      if (entity.checkIns) model.checkIns = entity.checkIns;
      if (entity.cancellations) model.cancellations = entity.cancellations;
      
      return model;
    });
  }

  async findById(id: number): Promise<BookingModel | null> {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.BookingId = :id', { id })
      .leftJoinAndSelect('booking.room', 'room')
      .leftJoinAndSelect('room.roomType', 'roomType') // Added join to roomType
      .leftJoinAndSelect('room.roomStatus', 'roomStatus') // Added join to roomStatus
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.staff', 'staff');

    // Join booking_statuses table manually
    queryBuilder.leftJoin('booking_statuses', 'bookingStatus', 'booking.StatusId = bookingStatus.StatusId');
    queryBuilder.addSelect([
      'bookingStatus.StatusId AS bookingStatus_StatusId',
      'bookingStatus.StatusName AS bookingStatus_StatusName'
    ]);

    const result = await queryBuilder.getRawAndEntities();
    
    if (result.entities.length === 0) {
      return null;
    }

    // Map result
    const entity = result.entities[0];
    const rawData = result.raw[0];
    
    const model = new BookingModel();
    model.BookingId = entity.BookingId;
    model.BookingDate = entity.BookingDate;
    model.RoomId = entity.RoomId;
    model.CheckinDate = entity.CheckinDate;
    model.CheckoutDate = entity.CheckoutDate;
    model.CustomerId = entity.CustomerId;
    model.StaffId = entity.StaffId;
    model.StatusId = entity.StatusId;
    model.CreatedAt = entity.CreatedAt;
    
    // Map relations with their nested objects
    if (entity.room) {
      model.room = {
        ...entity.room,
        roomType: entity.room.roomType || null,
        roomStatus: entity.room.roomStatus || null
      };
    }
    
    if (entity.customer) model.customer = entity.customer;
    if (entity.staff) model.staff = entity.staff;
    
    // Map BookingStatus from raw data
    if (rawData.bookingStatus_StatusId) {
      model.BookingStatus = {
        StatusId: rawData.bookingStatus_StatusId,
        StatusName: rawData.bookingStatus_StatusName
      };
    }
    
    // Map other related entities if loaded
    if (entity.checkIns) model.checkIns = entity.checkIns;
    if (entity.cancellations) model.cancellations = entity.cancellations;
    
    return model;
  }

  async findByCustomerId(CustomerId: number): Promise<BookingModel[]> {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.CustomerId = :CustomerId', { CustomerId })
      .leftJoinAndSelect('booking.room', 'room')
      .leftJoinAndSelect('room.roomType', 'roomType') // Added join to roomType
      .leftJoinAndSelect('room.roomStatus', 'roomStatus') // Added join to roomStatus
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.staff', 'staff');

    // Join booking_statuses table manually
    queryBuilder.leftJoin('booking_statuses', 'bookingStatus', 'booking.StatusId = bookingStatus.StatusId');
    queryBuilder.addSelect([
      'bookingStatus.StatusId AS bookingStatus_StatusId',
      'bookingStatus.StatusName AS bookingStatus_StatusName'
    ]);

    // Add ordering
    queryBuilder.orderBy('booking.BookingDate', 'DESC');

    const result = await queryBuilder.getRawAndEntities();
    
    // Map results
    return result.entities.map((entity, index) => {
      const rawData = result.raw[index];
      const model = new BookingModel();
      
      model.BookingId = entity.BookingId;
      model.BookingDate = entity.BookingDate;
      model.RoomId = entity.RoomId;
      model.CheckinDate = entity.CheckinDate;
      model.CheckoutDate = entity.CheckoutDate;
      model.CustomerId = entity.CustomerId;
      model.StaffId = entity.StaffId;
      model.StatusId = entity.StatusId;
      model.CreatedAt = entity.CreatedAt;
      
      // Map relations with their nested objects
      if (entity.room) {
        model.room = {
          ...entity.room,
          roomType: entity.room.roomType || null,
          roomStatus: entity.room.roomStatus || null
        };
      }
      
      if (entity.customer) model.customer = entity.customer;
      if (entity.staff) model.staff = entity.staff;
      
      // Map BookingStatus from raw data
      if (rawData.bookingStatus_StatusId) {
        model.BookingStatus = {
          StatusId: rawData.bookingStatus_StatusId,
          StatusName: rawData.bookingStatus_StatusName
        };
      }
      
      if (entity.checkIns) model.checkIns = entity.checkIns;
      if (entity.cancellations) model.cancellations = entity.cancellations;
      
      return model;
    });
  }

  async create(data: CreateBookingDto): Promise<BookingModel> {
    try {
      const entity = this.bookingRepository.create(data);
      const savedEntity = await this.bookingRepository.save(entity) as BookingEntity;
      
      // Load the full entity with relations
      return this.findById(savedEntity.BookingId);
    } catch (error) {
      this.logger.error(`Error creating booking: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateBookingDto): Promise<BookingModel> {
    const entity = await this.bookingRepository.findOne({
      where: { BookingId: id },
    });

    if (!entity) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    Object.assign(entity, data);

    await this.bookingRepository.save(entity);
    
    // Load the updated entity with relations
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.bookingRepository.delete(id);
    return result.affected > 0;
  }
}