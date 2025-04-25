// src/infrastructure/controllers/room-status.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoomStatusDto, UpdateRoomStatusDto } from '../../application/dtos/room-status.dto';
import { QueryDto } from '../../application/common/query.dto';
import { RoomStatusUseCase } from '../../application/use-cases/room-status.use-case';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { METADATA_KEY } from '../../core/constants/metadata.constant';
import { Public } from '../../core/decorators/public.decorator';

@ApiTags(METADATA_KEY.API_TAG.ROOM_STATUS)
@Controller('room-statuses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoomStatusController {
  constructor(
    private readonly roomStatusUseCase: RoomStatusUseCase
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all room statuses' })
  async findAll(@Query() query: QueryDto) {
    return this.roomStatusUseCase.query({ ...query, getType: 'many' });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get room status by ID' })
  async findOne(@Param('id') id: number) {
    return this.roomStatusUseCase.query({ 
      filter: { id }, 
      getType: 'one' 
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new room status' })
  async create(@Body() createRoomStatusDto: CreateRoomStatusDto) {
    return this.roomStatusUseCase.create(createRoomStatusDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a room status' })
  async update(@Param('id') id: number, @Body() updateRoomStatusDto: UpdateRoomStatusDto) {
    return this.roomStatusUseCase.update(id, updateRoomStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a room status' })
  async remove(@Param('id') id: number): Promise<boolean> {
    return this.roomStatusUseCase.delete(id);
  }

  @Post('query')
  @ApiOperation({ summary: 'Advanced room status query' })
  async query(@Body() query: QueryDto) {
    return this.roomStatusUseCase.query(query);
  }
}