import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckInEntity } from '../entities/check-in.entity';
import { CheckInModel } from '../../../core/domain/models/check-in.model';
import { QueryDto } from '../../../application/common/query.dto';
import { CreateCheckInDto, UpdateCheckInDto } from '../../../application/dtos/check-in.dto';

@Injectable()
export class CheckInRepository {
  constructor(
    @InjectRepository(CheckInEntity)
    private readonly checkInRepository: Repository<CheckInEntity>,
  ) {}

  async findAll(query: QueryDto = {}): Promise<CheckInModel[]> {
    try {
      const queryBuilder = this.checkInRepository.createQueryBuilder('checkIn');
      
      // Apply relations safely
      if (query.relations && query.relations.length > 0) {
        const relationsArray = Array.isArray(query.relations) 
          ? query.relations 
          : typeof query.relations === 'string' 
            ? [query.relations] 
            : [];
        
        const validRelations = ['room', 'customer', 'staff', 'booking', 'checkOuts'];
        
        relationsArray.forEach(relation => {
          if (validRelations.includes(relation)) {
            queryBuilder.leftJoinAndSelect(`checkIn.${relation}`, relation);
            
            // Add nested relations for room
            if (relation === 'room') {
              queryBuilder.leftJoinAndSelect('room.roomType', 'roomType');
              queryBuilder.leftJoinAndSelect('room.roomStatus', 'roomStatus');
            }
            
            // Add nested relations for booking
            if (relation === 'booking') {
              queryBuilder.leftJoinAndSelect('booking.BookingStatus', 'bookingStatus');
            }
            
            // Add nested relations for staff
            if (relation === 'staff') {
              queryBuilder.leftJoinAndSelect('staff.role', 'staffRole');
            }
          }
        });
      } else {
        // Default relations - เพิ่มทั้งหมดที่จำเป็น
        queryBuilder
          .leftJoinAndSelect('checkIn.room', 'room')
          .leftJoinAndSelect('room.roomType', 'roomType')
          .leftJoinAndSelect('room.roomStatus', 'roomStatus')
          .leftJoinAndSelect('checkIn.customer', 'customer')
          .leftJoinAndSelect('checkIn.staff', 'staff')
          .leftJoinAndSelect('staff.role', 'staffRole')
          .leftJoinAndSelect('checkIn.booking', 'booking')
          .leftJoinAndSelect('booking.BookingStatus', 'bookingStatus')
          .leftJoinAndSelect('checkIn.checkOuts', 'checkOuts');
      }

      // Apply manual filters instead of using QueryBuilderService
      if (query.filter) {
        Object.keys(query.filter).forEach((key, index) => {
          const value = query.filter[key];
          const paramKey = `${key}_${index}`;
          
          if (value !== null && value !== undefined) {
            queryBuilder.andWhere(`checkIn.${key} = :${paramKey}`, {
              [paramKey]: value
            });
          }
        });
      }

      // Apply sorting manually
      if (query.orderBy && typeof query.orderBy === 'object') {
        Object.keys(query.orderBy).forEach(key => {
          queryBuilder.addOrderBy(`checkIn.${key}`, query.orderBy[key]);
        });
      } else if (query.orderByField) {
        const order = query.order || 'ASC';
        queryBuilder.orderBy(`checkIn.${query.orderByField}`, order);
      } else {
        // Default sorting
        queryBuilder.orderBy('checkIn.CheckInDate', 'DESC');
      }

      // Apply pagination manually
      if (query.skip !== undefined) {
        queryBuilder.skip(query.skip);
      }
      
      if (query.take !== undefined) {
        queryBuilder.take(query.take);
      }
      
      const entities = await queryBuilder.getMany();
      return entities.map(entity => this.mapToModel(entity));
      
    } catch (error) {
      console.error('Error in CheckInRepository.findAll:', error);
      
      // Fallback: Simple query without complex joins
      try {
        console.log('Falling back to simple query...');
        const entities = await this.checkInRepository.find({
          relations: ['room', 'booking', 'customer', 'staff'],
          order: { CheckInId: 'DESC' },
          take: query.take || 100,
          skip: query.skip || 0
        });
        return entities.map(entity => this.mapToModel(entity));
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
        // Return minimal data
        const entities = await this.checkInRepository.find({
          order: { CheckInId: 'DESC' },
          take: query.take || 100,
          skip: query.skip || 0
        });
        return entities.map(entity => this.mapToModel(entity));
      }
    }
  }

  async findById(id: number, relations: string[] = ['room', 'customer', 'staff', 'booking', 'checkOuts']): Promise<CheckInModel | null> {
    try {
      const queryBuilder = this.checkInRepository
        .createQueryBuilder('checkIn')
        .leftJoinAndSelect('checkIn.room', 'room')
        .leftJoinAndSelect('room.roomType', 'roomType')
        .leftJoinAndSelect('room.roomStatus', 'roomStatus')
        .leftJoinAndSelect('checkIn.customer', 'customer')
        .leftJoinAndSelect('checkIn.staff', 'staff')
        .leftJoinAndSelect('staff.role', 'staffRole')
        .leftJoinAndSelect('checkIn.booking', 'booking')
        .leftJoinAndSelect('booking.BookingStatus', 'bookingStatus')
        .leftJoinAndSelect('checkIn.checkOuts', 'checkOuts')
        .where('checkIn.CheckInId = :id', { id });

      const entity = await queryBuilder.getOne();
      
      if (!entity) {
        return null;
      }
      
      return this.mapToModel(entity);
    } catch (error) {
      console.error('Error in CheckInRepository.findById:', error);
      
      // Fallback
      const entity = await this.checkInRepository.findOne({
        where: { CheckInId: id },
        relations: ['room', 'booking', 'customer', 'staff']
      });
      
      return entity ? this.mapToModel(entity) : null;
    }
  }

  async findByBookingId(bookingId: number): Promise<CheckInModel | null> {
    try {
      const entity = await this.checkInRepository
        .createQueryBuilder('checkIn')
        .leftJoinAndSelect('checkIn.room', 'room')
        .leftJoinAndSelect('room.roomType', 'roomType')
        .leftJoinAndSelect('room.roomStatus', 'roomStatus')
        .leftJoinAndSelect('checkIn.customer', 'customer')
        .leftJoinAndSelect('checkIn.staff', 'staff')
        .leftJoinAndSelect('checkIn.booking', 'booking')
        .leftJoinAndSelect('checkIn.checkOuts', 'checkOuts')
        .where('checkIn.BookingId = :bookingId', { bookingId })
        .getOne();
      
      if (!entity) {
        return null;
      }
      
      return this.mapToModel(entity);
    } catch (error) {
      console.error('Error in CheckInRepository.findByBookingId:', error);
      
      // Fallback
      const entity = await this.checkInRepository.findOne({
        where: { BookingId: bookingId },
        relations: ['booking', 'room', 'customer', 'staff', 'checkOuts']
      });
      
      return entity ? this.mapToModel(entity) : null;
    }
  }

  async findByCustomerId(customerId: number): Promise<CheckInModel[]> {
    try {
      const entities = await this.checkInRepository
        .createQueryBuilder('checkIn')
        .leftJoinAndSelect('checkIn.room', 'room')
        .leftJoinAndSelect('room.roomType', 'roomType')
        .leftJoinAndSelect('room.roomStatus', 'roomStatus')
        .leftJoinAndSelect('checkIn.customer', 'customer')
        .leftJoinAndSelect('checkIn.staff', 'staff')
        .leftJoinAndSelect('checkIn.booking', 'booking')
        .leftJoinAndSelect('checkIn.checkOuts', 'checkOuts')
        .where('checkIn.CustomerId = :customerId', { customerId })
        .orderBy('checkIn.CheckInDate', 'DESC')
        .getMany();
      
      return entities.map(entity => this.mapToModel(entity));
    } catch (error) {
      console.error('Error in CheckInRepository.findByCustomerId:', error);
      
      // Fallback
      const entities = await this.checkInRepository.find({
        where: { CustomerId: customerId },
        relations: ['booking', 'room', 'customer', 'staff', 'checkOuts'],
        order: { CheckInDate: 'DESC' }
      });
      
      return entities.map(entity => this.mapToModel(entity));
    }
  }

  async create(data: CreateCheckInDto): Promise<CheckInModel> {
    const entityData = {
      CheckInDate: data.CheckInDate,
      CheckoutDate: data.CheckoutDate,
      RoomId: data.RoomId,
      BookingId: data.BookingId,
      CustomerId: data.CustomerId,
      StaffId: data.StaffId
    };

    const entity = this.checkInRepository.create(entityData);
    
    try {
      const savedEntity = await this.checkInRepository.save(entity);
      // Load the full entity with relations
      return this.findById(savedEntity.CheckInId);
    } catch (error) {
      throw new Error(`Failed to create check-in: ${error.message}`);
    }
  }

  async update(id: number, data: UpdateCheckInDto): Promise<CheckInModel> {
    const entity = await this.checkInRepository.findOne({
      where: { CheckInId: id }
    });
    
    if (!entity) {
      throw new NotFoundException(`Check-in with id ${id} not found`);
    }
    
    // Update only provided fields
    if (data.CheckInDate !== undefined) entity.CheckInDate = data.CheckInDate;
    if (data.CheckoutDate !== undefined) entity.CheckoutDate = data.CheckoutDate;
    if (data.RoomId !== undefined) entity.RoomId = data.RoomId;
    if (data.BookingId !== undefined) entity.BookingId = data.BookingId;
    if (data.CustomerId !== undefined) entity.CustomerId = data.CustomerId;
    if (data.StaffId !== undefined) entity.StaffId = data.StaffId;
    
    await this.checkInRepository.save(entity);
    
    // Load the updated entity with relations
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.checkInRepository.delete({ CheckInId: id });
    return result.affected > 0;
  }

  private mapToModel(entity: CheckInEntity): CheckInModel {
    // ใช้ constructor ที่รับ Partial<CheckInModel> ตามที่คุณสร้าง
    return new CheckInModel({
      CheckInId: entity.CheckInId,
      CheckInDate: entity.CheckInDate,
      CheckoutDate: entity.CheckoutDate,
      RoomId: entity.RoomId,
      BookingId: entity.BookingId,
      CustomerId: entity.CustomerId,
      StaffId: entity.StaffId,
      
      // Map related entities
      room: entity.room ? {
        RoomId: entity.room.RoomId,
        TypeId: entity.room.TypeId,
        StatusId: entity.room.StatusId,
        RoomPrice: entity.room.RoomPrice,
        roomType: entity.room.roomType ? {
          TypeId: entity.room.roomType.TypeId,
          TypeName: entity.room.roomType.TypeName
        } : null,
        roomStatus: entity.room.roomStatus ? {
          StatusId: entity.room.roomStatus.StatusId,
          StatusName: entity.room.roomStatus.StatusName
        } : null
      } : undefined,

      booking: entity.booking ? {
        BookingId: entity.booking.BookingId,
        BookingDate: entity.booking.BookingDate,
        RoomId: entity.booking.RoomId,
        CheckinDate: entity.booking.CheckinDate,
        CheckoutDate: entity.booking.CheckoutDate,
        StatusId: entity.booking.StatusId,
        CustomerId: entity.booking.CustomerId,
        StaffId: entity.booking.StaffId,
        CreatedAt: entity.booking.CreatedAt
      } : undefined,

      customer: entity.customer ? {
        CustomerId: entity.customer.CustomerId,
        CustomerName: entity.customer.CustomerName,
        CustomerGender: entity.customer.CustomerGender,
        CustomerTel: entity.customer.CustomerTel,
        CustomerAddress: entity.customer.CustomerAddress,
        CustomerPostcode: entity.customer.CustomerPostcode
      } : undefined,

      staff: entity.staff ? {
        StaffId: entity.staff.StaffId,
        StaffName: entity.staff.StaffName,
        Gender: entity.staff.Gender,
        Tel: entity.staff.Tel,
        Address: entity.staff.Address,
        userName: entity.staff.userName,
        Salary: entity.staff.Salary
      } : undefined,

      // Map checkOuts if available
      checkOuts: entity.checkOuts && entity.checkOuts.length > 0 ? entity.checkOuts : undefined
    });
  }
}