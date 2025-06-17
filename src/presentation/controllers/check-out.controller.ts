// src/presentation/controllers/check-out.controller.ts (แก้ไขตาม pattern ของ check-in)
import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CheckOutService } from '../../application/services/check-out.service';
import { CreateCheckOutDto, UpdateCheckOutDto } from '../../application/dtos/check-out.dto';
import { QueryDto } from '../../application/common/query.dto';
import { CheckOutModel } from '../../core/domain/models/check-out.model';

@ApiTags('Check Outs')
@Controller('check-outs')
export class CheckOutController {
  constructor(private readonly checkOutService: CheckOutService) {}

  @Get()
  @ApiOperation({ summary: 'Get all check-outs' })
  @ApiResponse({ status: 200, description: 'List of check-outs' })
  async getAllCheckOuts(@Query() query?: QueryDto): Promise<CheckOutModel[]> {
    return this.checkOutService.query(query) as Promise<CheckOutModel[]>;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific check-out by ID' })
  @ApiResponse({ status: 200, description: 'Check-out details' })
  @ApiResponse({ status: 404, description: 'Check-out not found' })
  async getCheckOutById(@Param('id') id: number): Promise<CheckOutModel> {
    const queryDto: QueryDto = { 
      getType: 'one', 
      filter: { id } 
    };
    return this.checkOutService.query(queryDto) as Promise<CheckOutModel>;
  }

  @Get('checkin/:checkInId')
  @ApiOperation({ summary: 'Get check-out by check-in ID' })
  @ApiResponse({ status: 200, description: 'Check-out found' })
  @ApiResponse({ status: 404, description: 'Check-out not found' })
  async findByCheckInId(@Param('checkInId') checkInId: number): Promise<CheckOutModel> {
    const checkOut = await this.checkOutService.findByCheckInId(checkInId);
    if (!checkOut) {
      throw new NotFoundException(`Check-out for check-in ID ${checkInId} not found`);
    }
    return checkOut;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new check-out' })
  @ApiResponse({ status: 201, description: 'Check-out created successfully' })
  @HttpCode(HttpStatus.CREATED)
  async createCheckOut(@Body() data: CreateCheckOutDto): Promise<CheckOutModel> {
    return this.checkOutService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing check-out' })
  @ApiResponse({ status: 200, description: 'Check-out updated successfully' })
  @ApiResponse({ status: 404, description: 'Check-out not found' })
  async updateCheckOut(
    @Param('id') id: number, 
    @Body() data: UpdateCheckOutDto
  ): Promise<boolean> {
    return this.checkOutService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a check-out' })
  @ApiResponse({ status: 200, description: 'Check-out deleted successfully' })
  @ApiResponse({ status: 404, description: 'Check-out not found' })
  @HttpCode(HttpStatus.OK)
  async deleteCheckOut(@Param('id') id: number): Promise<boolean> {
    return this.checkOutService.delete(id);
  }
}

