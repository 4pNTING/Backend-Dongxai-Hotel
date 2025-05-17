// src/presentation/controllers/booking-status.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBookingStatusDto, UpdateBookingStatusDto } from '../../application/dtos/booking-status.dto';
import { QueryDto } from '../../application/common/query.dto';
import { BookingStatusUseCase } from '../../application/use-cases/booking-status.use-case';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { METADATA_KEY } from '../../core/constants/metadata.constant';
import { Public } from '../../core/decorators/public.decorator';

@ApiTags(METADATA_KEY.API_TAG.BOOKING_STATUS)
@Controller('booking-statuses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingStatusController {
  constructor(
    private readonly bookingStatusUseCase: BookingStatusUseCase
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all booking statuses' })
  async findAll(@Query() query: QueryDto) {
    return this.bookingStatusUseCase.query({ ...query, getType: 'many' });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get booking status by ID' })
  async findOne(@Param('id') id: number) {
    return this.bookingStatusUseCase.query({ 
      filter: { id }, 
      getType: 'one' 
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new booking status' })
  async create(@Body() createBookingStatusDto: CreateBookingStatusDto) {
    return this.bookingStatusUseCase.create(createBookingStatusDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a booking status' })
  async update(@Param('id') id: number, @Body() updateBookingStatusDto: UpdateBookingStatusDto) {
    return this.bookingStatusUseCase.update(id, updateBookingStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking status' })
  async remove(@Param('id') id: number): Promise<boolean> {
    return this.bookingStatusUseCase.delete(id);
  }

  @Post('query')
  @ApiOperation({ summary: 'Advanced booking status query' })
  async query(@Body() query: QueryDto) {
    return this.bookingStatusUseCase.query(query);
  }
}