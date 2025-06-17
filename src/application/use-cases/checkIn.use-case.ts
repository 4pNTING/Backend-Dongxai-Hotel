import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { QueryDto } from '../common/query.dto';
import { CheckInServicePort } from '../ports/check-in.port';
import { CheckInModel } from '../../core/domain/models/check-in.model';
import { CreateCheckInDto, UpdateCheckInDto } from '../dtos/check-in.dto';

@Injectable()
export class CheckInUseCase {
  constructor(
    @Inject('CheckInServicePort')
    private readonly service: CheckInServicePort
  ) {}

  async query(dto: QueryDto): Promise<CheckInModel | CheckInModel[]> {
    return this.service.query(dto);
  }

  async create(dto: CreateCheckInDto): Promise<CheckInModel> {
    // Add business logic validation here
    await this.validateCheckInData(dto);
    return this.service.create(dto);
  }

  async update(id: number, dto: UpdateCheckInDto): Promise<CheckInModel> {
    // Return CheckInModel instead of boolean for consistency
    const checkIn = await this.service.findById(id);
    if (!checkIn) {
      throw new NotFoundException(`Check-in with ID ${id} not found`);
    }
    
    await this.service.update(id, dto);
    return this.service.findById(id); // Return updated model
  }

  async delete(id: number): Promise<boolean> {
    return this.service.delete(id);
  }

  // ===== Additional Methods =====
  async findById(id: number): Promise<CheckInModel> {
    const checkIn = await this.service.findById(id);
    if (!checkIn) {
      throw new NotFoundException(`Check-in with ID ${id} not found`);
    }
    return checkIn;
  }

  async findByCustomerId(customerId: number): Promise<CheckInModel[]> {
    return this.service.findByCustomerId(customerId);
  }

  async findByBookingId(bookingId: number): Promise<CheckInModel | null> {
    return this.service.findByBookingId(bookingId);
  }

  // ===== Check-in Workflow =====
  async checkoutCheckIn(id: number): Promise<CheckInModel> {
    const checkIn = await this.findById(id);
    
    // Check if already checked out
    if (checkIn.checkOuts && checkIn.checkOuts.length > 0) {
      throw new BadRequestException('This check-in has already been checked out');
    }

    // Business logic for checkout would go here
    // For now, just return the check-in
    return checkIn;
  }

  // ===== Private Methods =====
  private async validateCheckInData(dto: CreateCheckInDto): Promise<void> {
    // Validate dates
    const checkInDate = new Date(dto.CheckInDate);
    const checkoutDate = new Date(dto.CheckoutDate);

    if (checkoutDate <= checkInDate) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }

    // Validate room availability (if needed)
    // Add more business validations here
  }
}