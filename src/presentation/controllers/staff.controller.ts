// src/presentation/controllers/staff.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateStaffDto, UpdateStaffDto } from '../../application/dtos/staff.dto';
import { QueryDto } from '../../application/common/query.dto';
import { StaffUseCase } from '../../application/use-cases/Staff-use-case';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { METADATA_KEY } from '../../core/constants/metadata.constant';

@ApiTags(METADATA_KEY.API_TAG.STAFF)
@Controller('staff')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StaffController {
  constructor(
    private readonly staffUseCase: StaffUseCase
  ) {}

  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.staffUseCase.query({ ...query, getType: 'many' });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.staffUseCase.query({ 
      filter: { id }, 
      getType: 'one' 
    });
  }

  @Post('query')
  async queryStaff(@Body() query: QueryDto) {
    return this.staffUseCase.query(query);
  }

  @Post('create')
  async create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffUseCase.create(createStaffDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffUseCase.update(id, updateStaffDto);
  }
  
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<boolean> {
    return this.staffUseCase.delete(id);
  }
}