// src/infrastructure/controllers/booking.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateBookingDto, UpdateBookingDto } from '../../application/dtos/booking.dto';
import { QueryDto } from '../../application/common/query.dto';
import { BookingUseCase } from '../../application/use-cases/booking.use-case';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { METADATA_KEY } from '../../core/constants/metadata.constant';

@ApiTags(METADATA_KEY.API_TAG.BOOKING)
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingUseCase: BookingUseCase) { }

  // ===== Basic CRUD =====
  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.bookingUseCase.query({ ...query, getType: 'many' });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.bookingUseCase.query({
      filter: { id },
      getType: 'one'
    });
  }

  @Post('create')
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingUseCase.create(createBookingDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingUseCase.update(id, updateBookingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<boolean> {
    return this.bookingUseCase.delete(id);
  }

  // ===== Booking Workflow =====
  @Patch(':id/confirm')
  async confirmBooking(@Param('id') id: number) {
    return this.bookingUseCase.confirmBooking(id);
  }

  @Patch(':id/checkin')
  async checkinBooking(@Param('id') id: number) {
    return this.bookingUseCase.checkinBooking(id);
  }

  @Patch(':id/checkout')
  async checkoutBooking(@Param('id') id: number) {
    return this.bookingUseCase.checkoutBooking(id);
  }

  
  @Patch(':id/cancel')
  async cancelBooking(@Param('id') id: number) {
    return this.bookingUseCase.cancelBooking(id);
  }

  @Post('query')
  async queryBookings(@Body() query: QueryDto) {
    return this.bookingUseCase.query({ ...query, getType: 'many' });
  }
}