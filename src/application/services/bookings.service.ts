import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { BookingRepository } from '../../infrastructure/persistence/repositories/booking.repository';
import { CheckInRepository } from '../../infrastructure/persistence/repositories/check-in.repository';
import { QueryDto } from '../common/query.dto';
import { BookingModel } from '../../core/domain/models/booking.model';
import { CreateBookingDto, UpdateBookingDto } from '../dtos/booking.dto';
import { BookingServicePort } from '../ports/booking.prot';

@Injectable()
export class BookingService implements BookingServicePort {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private bookingRepository: BookingRepository,
    private checkInRepository: CheckInRepository
  ) {}

  async query(dto: QueryDto): Promise<BookingModel | BookingModel[]> {
    if (dto.getType === 'one' && dto.filter && dto.filter.id) {
      const booking = await this.bookingRepository.findById(dto.filter.id);
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${dto.filter.id} not found`);
      }
      return booking;
    }
    return this.bookingRepository.findAll(dto);
  }

  async create(dto: CreateBookingDto): Promise<BookingModel> {
    return this.bookingRepository.create(dto);
  }

  async update(id: number, dto: UpdateBookingDto): Promise<boolean> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    await this.bookingRepository.update(id, dto);
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return this.bookingRepository.delete(id);
  }

  // ===== เพิ่ม Methods สำหรับจัดการสถานะ =====
  
  async getPendingConfirmations(customQuery?: QueryDto): Promise<BookingModel[]> {
    const defaultQuery: QueryDto = {
      filter: { StatusId: 1 }, // สถานะรอการยืนยัน
      relations: ['room', 'customer', 'staff'],
      orderBy: { BookingDate: 'DESC' },
      getType: 'many'
    };
    
    // รวม query ที่ส่งเข้ามากับ default query
    const finalQuery = customQuery ? { ...defaultQuery, ...customQuery } : defaultQuery;
    return this.bookingRepository.findAll(finalQuery);
  }

  async getConfirmedBookings(customQuery?: QueryDto): Promise<BookingModel[]> {
    const defaultQuery: QueryDto = {
      filter: { StatusId: 2 }, // สถานะยืนยันแล้ว
      relations: ['room', 'customer', 'staff'],
      orderBy: { CheckinDate: 'ASC' },
      getType: 'many'
    };
    
    // รวม query ที่ส่งเข้ามากับ default query
    const finalQuery = customQuery ? { ...defaultQuery, ...customQuery } : defaultQuery;
    return this.bookingRepository.findAll(finalQuery);
  }

  async getCheckedInBookings(customQuery?: QueryDto): Promise<BookingModel[]> {
    const defaultQuery: QueryDto = {
      filter: { StatusId: 3 }, // สถานะเช็คอินแล้ว
      relations: ['room', 'customer', 'staff'],
      orderBy: { CheckinDate: 'DESC' },
      getType: 'many'
    };
    
    // รวม query ที่ส่งเข้ามากับ default query
    const finalQuery = customQuery ? { ...defaultQuery, ...customQuery } : defaultQuery;
    return this.bookingRepository.findAll(finalQuery);
  }

  async confirmBooking(id: number): Promise<BookingModel> {
    this.logger.log(`Confirming booking with ID: ${id}`);
    
    // ตรวจสอบว่า booking มีอยู่หรือไม่
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // ตรวจสอบสถานะปัจจุบัน
    if (booking.StatusId !== 1) {
      throw new BadRequestException(
        `Cannot confirm booking. Current status is ${booking.StatusId}, expected status 1 (pending confirmation)`
      );
    }

    // อัปเดตสถานะเป็น "ยืนยันแล้ว" (StatusId = 2)
    const updateData: UpdateBookingDto = {
      StatusId: 2
    };

    await this.bookingRepository.update(id, updateData);
    
    // ดึงข้อมูลที่อัปเดตแล้ว
    const updatedBooking = await this.bookingRepository.findById(id);
    
    this.logger.log(`Booking ${id} confirmed successfully`);
    return updatedBooking;
  }

  async checkinBooking(id: number): Promise<BookingModel> {
    console.log('=== CHECKIN DEBUG START ===');
    this.logger.log(`🏨 Checking in booking with ID: ${id}`);
    
    // ตรวจสอบว่า booking มีอยู่หรือไม่
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      console.log('❌ Booking not found:', id);
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    console.log('✅ Found booking:', JSON.stringify(booking, null, 2));

    // ตรวจสอบสถานะปัจจุบัน
    if (booking.StatusId !== 2) {
      console.log('❌ Wrong status:', booking.StatusId, 'expected: 2');
      throw new BadRequestException(
        `Cannot check-in booking. Current status is ${booking.StatusId}, expected status 2 (confirmed)`
      );
    }
    console.log('✅ Status check passed: StatusId =', booking.StatusId);

    // ตรวจสอบวันที่เช็คอิน - อนุญาต Early Check-in
    const today = new Date();
    const checkinDate = new Date(booking.CheckinDate);
    const maxEarlyDays = 1; // อนุญาตเช็คอินก่อนกำหนด 1 วัน

    // คำนวณวันที่เร็วสุดที่อนุญาตให้เช็คอิน
    const earliestAllowed = new Date(checkinDate);
    earliestAllowed.setDate(earliestAllowed.getDate() - maxEarlyDays);

    // เปรียบเทียบเฉพาะวันที่ ไม่รวมเวลา
    today.setHours(0, 0, 0, 0);
    checkinDate.setHours(0, 0, 0, 0);
    earliestAllowed.setHours(0, 0, 0, 0);

    console.log('📅 Date check - Today:', today);
    console.log('📅 Scheduled check-in:', checkinDate);
    console.log('📅 Earliest allowed:', earliestAllowed);

    // แก้ไข type error - แปลงเป็น number ก่อนเปรียบเทียบ
    const todayTime = today.getTime();
    const earliestTime = earliestAllowed.getTime();
    const checkinTime = checkinDate.getTime();

    if (todayTime < earliestTime) {
      console.log('❌ Date check failed - too early');
      throw new BadRequestException(
        `เช็คอินก่อนกำหนดได้สูงสุด ${maxEarlyDays} วัน. วันที่เช็คอินเร็วสุด: ${earliestAllowed.toISOString().split('T')[0]}`
      );
    }

    // ตรวจสอบว่าเป็น early check-in หรือไม่
    if (todayTime < checkinTime) {
      const daysDiff = Math.ceil((checkinTime - todayTime) / (1000 * 60 * 60 * 24));
      this.logger.log(`⚠️ Early check-in ${daysDiff} day(s) for booking ${id}`);
      console.log(`✅ Early check-in approved: ${daysDiff} day(s) before scheduled date`);
    } else if (todayTime === checkinTime) {
      console.log('✅ Date check passed - on schedule');
    } else {
      const daysDiff = Math.ceil((todayTime - checkinTime) / (1000 * 60 * 60 * 24));
      this.logger.log(`⚠️ Late check-in ${daysDiff} day(s) for booking ${id}`);
      console.log(`✅ Late check-in allowed: ${daysDiff} day(s) after scheduled date`);
    }

    // ตรวจสอบว่ามี check-in record อยู่แล้วหรือไม่
    const existingCheckIn = await this.checkInRepository.findByBookingId(id);
    if (existingCheckIn) {
      console.log('❌ Already checked in:', existingCheckIn);
      throw new BadRequestException('Booking has already been checked in');
    }
    console.log('✅ No existing check-in found');

    // สร้าง check-in record
    const checkInData = {
      CheckInDate: new Date(), // ใช้วันที่ปัจจุบันที่เช็คอินจริง
      CheckoutDate: booking.CheckoutDate,
      RoomId: booking.RoomId,
      BookingId: booking.BookingId,
      CustomerId: booking.CustomerId,
      StaffId: booking.StaffId
    };

    console.log('🔄 Creating check-in with data:', JSON.stringify(checkInData, null, 2));

    try {
      const createdCheckIn = await this.checkInRepository.create(checkInData);
      console.log('✅ Check-in created successfully:', JSON.stringify(createdCheckIn, null, 2));
    } catch (error) {
      console.log('❌ Check-in creation failed:', error.message);
      console.log('❌ Error stack:', error.stack);
      throw new BadRequestException(`Failed to create check-in record: ${error.message}`);
    }

    // อัปเดตสถานะเป็น "เช็คอินแล้ว" (StatusId = 3)
    const updateData: UpdateBookingDto = {
      StatusId: 3
    };

    console.log('🔄 Updating booking status to 3');
    await this.bookingRepository.update(id, updateData);
    
    // ดึงข้อมูลที่อัปเดตแล้ว
    const updatedBooking = await this.bookingRepository.findById(id);
    console.log('✅ Booking updated:', JSON.stringify(updatedBooking, null, 2));
    
    console.log('=== CHECKIN DEBUG END ===');
    this.logger.log(`✅ Booking ${id} checked in successfully`);
    return updatedBooking;
  }

  async checkoutBooking(id: number): Promise<BookingModel> {
    this.logger.log(`Checking out booking with ID: ${id}`);
    
    // ตรวจสอบว่า booking มีอยู่หรือไม่
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // ตรวจสอบสถานะปัจจุบัน
    if (booking.StatusId !== 3) {
      throw new BadRequestException(
        `Cannot check-out booking. Current status is ${booking.StatusId}, expected status 3 (checked-in)`
      );
    }

    // ตรวจสอบว่ามี check-in record หรือไม่
    const checkIn = await this.checkInRepository.findByBookingId(id);
    if (!checkIn) {
      throw new BadRequestException('No check-in record found for this booking');
    }

    // อัปเดตสถานะเป็น "เช็คเอาท์แล้ว" (StatusId = 4)
    const updateData: UpdateBookingDto = {
      StatusId: 4
    };

    await this.bookingRepository.update(id, updateData);
    
    // ดึงข้อมูลที่อัปเดตแล้ว
    const updatedBooking = await this.bookingRepository.findById(id);
    
    this.logger.log(`Booking ${id} checked out successfully`);
    return updatedBooking;
  }
}