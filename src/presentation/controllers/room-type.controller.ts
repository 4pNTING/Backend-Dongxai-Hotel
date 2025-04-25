// src/infrastructure/controllers/room-type.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoomTypeDto, UpdateRoomTypeDto } from '../../application/dtos/room-type.dto';
import { QueryDto } from '../../application/common/query.dto';
import { RoomTypeUseCase } from '../../application/use-cases/room-type.use-case';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { METADATA_KEY } from '../../core/constants/metadata.constant';
import { Public } from '../../core/decorators/public.decorator';

@ApiTags(METADATA_KEY.API_TAG.ROOM_TYPE)
@Controller('room-types')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoomTypeController {
  constructor(
    private readonly roomTypeUseCase: RoomTypeUseCase
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all room types' })
  async findAll(@Query() query: QueryDto) {
    return this.roomTypeUseCase.query({ ...query, getType: 'many' });
  }
  
  @Post('query')  // ย้ายมาก่อน routes ที่มี path parameters
  @ApiOperation({ summary: 'Advanced room type query' })
  async query(@Body() query: QueryDto) {
    return this.roomTypeUseCase.query(query);
  }
  
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get room type by ID' })
  async findOne(@Param('id') id: number) {
    return this.roomTypeUseCase.query({ 
      filter: { id }, 
      getType: 'one' 
    });
  }
  
  @Post()
  @ApiOperation({ summary: 'Create a new room type' })
  async create(@Body() createRoomTypeDto: CreateRoomTypeDto) {
    return this.roomTypeUseCase.create(createRoomTypeDto);
  }
  
  @Put(':id')
  @ApiOperation({ summary: 'Update a room type' })
  async update(@Param('id') id: number, @Body() updateRoomTypeDto: UpdateRoomTypeDto) {
    return this.roomTypeUseCase.update(id, updateRoomTypeDto);
  }
  
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a room type' })
  async remove(@Param('id') id: number): Promise<boolean> {
    return this.roomTypeUseCase.delete(id);
  }
}