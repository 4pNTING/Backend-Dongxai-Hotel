// src/infrastructure/persistence/repositories/booking.repository.ts
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity } from '../entities/booking.entity';
import { BookingModel } from '../../../core/domain/models/booking.model';
import { QueryDto } from '../../../application/common/query.dto';
import { CreateBookingDto, UpdateBookingDto } from '../../../application/dtos/booking.dto';
import { CreateCheckInDto } from '../../../application/dtos/check-in.dto';
import { CreateCheckOutDto } from '../../../application/dtos/check-out.dto';
import { CreateCancellationDto } from '../../../application/dtos/cancellation.dto';
import { CheckInRepository } from './check-in.repository';
import { CheckOutRepository } from './check-out.repository';
import { CancellationRepository } from './cancellation.repository';
import { QueryBuilderService } from '../../services/query-builder.service';

@Injectable()
export class BookingRepository {
  private readonly logger = new Logger(BookingRepository.name);

  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    private checkInRepository: CheckInRepository,
    private checkOutRepository: CheckOutRepository,
    private cancellationRepository: CancellationRepository,
    private queryBuilderService: QueryBuilderService,
  ) { }

  // ===== Basic CRUD Operations =====

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
      return this.mapToModel(entity, rawData);
    });
  }

  async findById(id: number): Promise<BookingModel | null> {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.BookingId = :id', { id })
      .leftJoinAndSelect('booking.room', 'room')
      .leftJoinAndSelect('room.roomType', 'roomType')
      .leftJoinAndSelect('room.roomStatus', 'roomStatus')
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
    
    return this.mapToModel(entity, rawData);
  }

  async findByCustomerId(CustomerId: number): Promise<BookingModel[]> {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.CustomerId = :CustomerId', { CustomerId })
      .leftJoinAndSelect('booking.room', 'room')
      .leftJoinAndSelect('room.roomType', 'roomType') 
      .leftJoinAndSelect('room.roomStatus', 'roomStatus') 
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
      return this.mapToModel(entity, rawData);
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

  // ===== Status-Based Query Methods =====
  
  async getPendingConfirmations(customQuery?: QueryDto): Promise<BookingModel[]> {
    const defaultQuery = this.queryBuilderService.createStatusQuery(1, ['room', 'customer', 'staff']);
    defaultQuery.orderBy = { BookingDate: 'DESC' };
    
    const finalQuery = customQuery ? 
      this.queryBuilderService.mergeFilters(defaultQuery, customQuery) : defaultQuery;
    return this.findAll(finalQuery);
  }

  async getConfirmedBookings(customQuery?: QueryDto): Promise<BookingModel[]> {
    const defaultQuery = this.queryBuilderService.createStatusQuery(2, ['room', 'customer', 'staff']);
    defaultQuery.orderBy = { CheckinDate: 'ASC' };
    
    const finalQuery = customQuery ? 
      this.queryBuilderService.mergeFilters(defaultQuery, customQuery) : defaultQuery;
    return this.findAll(finalQuery);
  }

  async getCheckedInBookings(customQuery?: QueryDto): Promise<BookingModel[]> {
    const defaultQuery = this.queryBuilderService.createStatusQuery(3, ['room', 'customer', 'staff']);
    defaultQuery.orderBy = { CheckinDate: 'DESC' };
    
    const finalQuery = customQuery ? 
      this.queryBuilderService.mergeFilters(defaultQuery, customQuery) : defaultQuery;
    return this.findAll(finalQuery);
  }

  async getCancelledBookings(customQuery?: QueryDto): Promise<BookingModel[]> {
    const defaultQuery = this.queryBuilderService.createStatusQuery(5, ['room', 'customer', 'staff']);
    defaultQuery.orderBy = { BookingDate: 'DESC' };
    
    const finalQuery = customQuery ? 
      this.queryBuilderService.mergeFilters(defaultQuery, customQuery) : defaultQuery;
    return this.findAll(finalQuery);
  }

  async getCompletedBookings(customQuery?: QueryDto): Promise<BookingModel[]> {
    const defaultQuery = this.queryBuilderService.createStatusQuery(4, ['room', 'customer', 'staff']);
    defaultQuery.orderBy = { CheckoutDate: 'DESC' };
    
    const finalQuery = customQuery ? 
      this.queryBuilderService.mergeFilters(defaultQuery, customQuery) : defaultQuery;
    return this.findAll(finalQuery);
  }

  // ===== Rich Domain Workflow Methods =====

  async confirmBooking(id: number): Promise<BookingModel> {
    this.logger.log(`Confirming booking with ID: ${id}`);
    
    const booking = await this.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    if (booking.StatusId !== 1) {
      throw new BadRequestException(
        `Cannot confirm booking. Current status is ${booking.StatusId}, expected status 1 (pending confirmation)`
      );
    }

    const updateData: UpdateBookingDto = { StatusId: 2 };
    const updatedBooking = await this.update(id, updateData);
    
    this.logger.log(`Booking ${id} confirmed successfully`);
    return updatedBooking;
  }

  async checkinBooking(id: number): Promise<BookingModel> {
    this.logger.log(`Checking in booking with ID: ${id}`);
    
    const booking = await this.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    if (booking.StatusId !== 2) {
      throw new BadRequestException(
        `Cannot check-in booking. Current status is ${booking.StatusId}, expected status 2 (confirmed)`
      );
    }

    // Validate check-in date
    this.validateCheckinDate(booking.CheckinDate);

    // Check for existing check-in
    const existingCheckIn = await this.checkInRepository.findByBookingId(id);
    if (existingCheckIn) {
      throw new BadRequestException('Booking has already been checked in');
    }

    // Create check-in record
    const checkInData: CreateCheckInDto = {
      CheckInDate: new Date(),
      CheckoutDate: booking.CheckoutDate,
      RoomId: booking.RoomId,
      BookingId: booking.BookingId,
      CustomerId: booking.CustomerId,
      StaffId: booking.StaffId
    };

    await this.checkInRepository.create(checkInData);

    // Update booking status
    const updateData: UpdateBookingDto = { StatusId: 3 };
    const updatedBooking = await this.update(id, updateData);
    
    this.logger.log(`Booking ${id} checked in successfully`);
    return updatedBooking;
  }

  async checkoutBooking(id: number): Promise<BookingModel> {
    this.logger.log(`Checking out booking with ID: ${id}`);
    
    const booking = await this.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    if (booking.StatusId !== 3) {
      throw new BadRequestException(
        `Cannot check-out booking. Current status is ${booking.StatusId}, expected status 3 (checked-in)`
      );
    }

    // Get check-in record
    const checkIn = await this.checkInRepository.findByBookingId(id);
    if (!checkIn) {
      throw new BadRequestException('No check-in record found for this booking');
    }

    // Create check-out record
    const checkOutData: CreateCheckOutDto = {
      CheckoutDate: new Date(),
      CheckinId: checkIn.CheckInId,
      RoomId: booking.RoomId,
      StaffId: booking.StaffId || 1
    };

    await this.checkOutRepository.create(checkOutData);

    // Update booking status
    const updateData: UpdateBookingDto = { StatusId: 4 };
    const updatedBooking = await this.update(id, updateData);
    
    this.logger.log(`Booking ${id} checked out successfully`);
    return updatedBooking;
  }

  async cancelBooking(id: number): Promise<BookingModel> {
    this.logger.log(`Canceling booking with ID: ${id}`);
    
    const booking = await this.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Can only cancel pending (1) or confirmed (2) bookings
    if (booking.StatusId !== 1 && booking.StatusId !== 2) {
      throw new BadRequestException(
        `Cannot cancel booking. Current status is ${booking.StatusId}, can only cancel pending (1) or confirmed (2) bookings`
      );
    }

    // Create cancellation record
    const cancellationData: CreateCancellationDto = {
      CancelDate: new Date(),
      StaffId: booking.StaffId || 1,
      BookingId: booking.BookingId
    };

    await this.cancellationRepository.create(cancellationData);

    // Update booking status
    const updateData: UpdateBookingDto = { StatusId: 5 };
    const updatedBooking = await this.update(id, updateData);
    
    this.logger.log(`Booking ${id} canceled successfully`);
    return updatedBooking;
  }

  // ===== Statistics Methods =====

  async getBookingStats(): Promise<{
    pending: number;
    confirmed: number;
    checkedIn: number;
    completed: number;
    cancelled: number;
  }> {
    const [pending, confirmed, checkedIn, completed, cancelled] = await Promise.all([
      this.getPendingConfirmations(),
      this.getConfirmedBookings(),
      this.getCheckedInBookings(),
      this.getCompletedBookings(),
      this.getCancelledBookings()
    ]);

    return {
      pending: Array.isArray(pending) ? pending.length : 0,
      confirmed: Array.isArray(confirmed) ? confirmed.length : 0,
      checkedIn: Array.isArray(checkedIn) ? checkedIn.length : 0,
      completed: Array.isArray(completed) ? completed.length : 0,
      cancelled: Array.isArray(cancelled) ? cancelled.length : 0
    };
  }

  // ===== Private Helper Methods =====

  private validateCheckinDate(checkinDate: Date): void {
    const today = new Date();
    const scheduledCheckin = new Date(checkinDate);
    const maxEarlyDays = 1; // Allow check-in 1 day early

    const earliestAllowed = new Date(scheduledCheckin);
    earliestAllowed.setDate(earliestAllowed.getDate() - maxEarlyDays);

    // Reset time for date-only comparison
    today.setHours(0, 0, 0, 0);
    scheduledCheckin.setHours(0, 0, 0, 0);
    earliestAllowed.setHours(0, 0, 0, 0);

    if (today.getTime() < earliestAllowed.getTime()) {
      throw new BadRequestException(
        `เช็คอินก่อนกำหนดได้สูงสุด ${maxEarlyDays} วัน. วันที่เช็คอินเร็วสุด: ${earliestAllowed.toISOString().split('T')[0]}`
      );
    }

    // Log early/late check-in for monitoring
    const todayTime = today.getTime();
    const checkinTime = scheduledCheckin.getTime();
    
    if (todayTime < checkinTime) {
      const daysDiff = Math.ceil((checkinTime - todayTime) / (1000 * 60 * 60 * 24));
      this.logger.log(`Early check-in ${daysDiff} day(s) approved`);
    } else if (todayTime > checkinTime) {
      const daysDiff = Math.ceil((todayTime - checkinTime) / (1000 * 60 * 60 * 24));
      this.logger.log(`Late check-in ${daysDiff} day(s) allowed`);
    }
  }

  private mapToModel(entity: BookingEntity, rawData?: any): BookingModel {
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
    if (rawData && rawData.bookingStatus_StatusId) {
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
}