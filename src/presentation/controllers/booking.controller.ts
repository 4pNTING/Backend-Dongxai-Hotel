// src/application/controllers/bookings.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  constructor(private readonly bookingUseCase: BookingUseCase) {}

  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.bookingUseCase.query({ ...query, getType: 'many' });
  }

  @Post('query')  // เพิ่ม endpoint นี้
async queryBookings(@Body() query: QueryDto) {
  return this.bookingUseCase.query({ ...query, getType: 'many' });
}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.bookingUseCase.query({ 
      filter: { id }, 
      getType: 'one' 
    });
  }

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingUseCase.create(createBookingDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingUseCase.update(id, updateBookingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<boolean> {
    return this.bookingUseCase.delete(id);
  }
}