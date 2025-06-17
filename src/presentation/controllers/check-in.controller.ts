import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCheckInDto, UpdateCheckInDto } from '../../application/dtos/check-in.dto';
import { QueryDto } from '../../application/common/query.dto';
import { CheckInUseCase } from '../../application/use-cases/checkIn.use-case';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { METADATA_KEY } from '../../core/constants/metadata.constant';

@ApiTags('Check Ins')
@Controller('check-ins')
@UseGuards(JwtAuthGuard) // เพิ่ม Auth Guard
@ApiBearerAuth()
export class CheckInController {
  constructor(private readonly checkInUseCase: CheckInUseCase) {} // ใช้ UseCase

  // ===== Basic CRUD =====
  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.checkInUseCase.query({ ...query, getType: 'many' });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.checkInUseCase.query({
      filter: { id },
      getType: 'one'
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCheckInDto: CreateCheckInDto) {
    return this.checkInUseCase.create(createCheckInDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateCheckInDto: UpdateCheckInDto) {
    return this.checkInUseCase.update(id, updateCheckInDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<boolean> {
    return this.checkInUseCase.delete(id);
  }

  // ===== Query Helpers ===== (เหมือน Booking)
  @Post('query')
  async queryCheckIns(@Body() query: QueryDto) {
    return this.checkInUseCase.query({ ...query, getType: 'many' });
  }

  // ===== Specialized Endpoints =====
  @Post('customer/:customerId')  
  async findByCustomerId(@Param('customerId') customerId: number) {
    return this.checkInUseCase.findByCustomerId(customerId);
  }

  @Post('booking/:bookingId')  // ใหม่
  async findByBookingId(@Param('bookingId') bookingId: number) {
    return this.checkInUseCase.findByBookingId(bookingId);
  }

  // ===== Check-in Workflow ===== (เหมือน Booking Workflow)
  @Patch(':id/checkout')
  @ApiOperation({ summary: 'Check-out a check-in' })
  async checkoutCheckIn(@Param('id') id: number) {
    return this.checkInUseCase.checkoutCheckIn(id);
  }
}