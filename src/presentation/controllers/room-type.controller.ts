// src/application/controllers/room-type.controller.ts
import {  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  import { RoomTypeService } from '../../application/services/room-type.service';
  import { CreateRoomTypeDto, UpdateRoomTypeDto } from '../../application/dtos/room-type.dto';
  import { QueryDto } from '../../application/common/query.dto';
  import { RoomTypeModel } from '../../core/domain/models/room-type.model';
  
  @ApiTags('Room Types')
  @Controller('room-types')
  export class RoomTypeController {
    constructor(private readonly roomTypeService: RoomTypeService) {}
  
    @Get()
    @ApiOperation({ summary: 'Get all room types' })
    @ApiResponse({ status: 200, description: 'List of room types' })
    async getAllRoomTypes(@Query() query?: QueryDto): Promise<RoomTypeModel[]> {
      return this.roomTypeService.getAllRoomTypes(query);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a specific room type by ID' })
    @ApiResponse({ status: 200, description: 'Room type details' })
    @ApiResponse({ status: 404, description: 'Room type not found' })
    async getRoomTypeById(@Param('id') id: number): Promise<RoomTypeModel> {
      return this.roomTypeService.getRoomTypeById(id);
    }
  
    @Post()
    @ApiOperation({ summary: 'Create a new room type' })
    @ApiResponse({ status: 201, description: 'Room type created successfully' })
    @ApiResponse({ status: 409, description: 'Room type already exists' })
    @HttpCode(HttpStatus.CREATED)
    async createRoomType(@Body() data: CreateRoomTypeDto): Promise<RoomTypeModel> {
      return this.roomTypeService.createRoomType(data);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update an existing room type' })
    @ApiResponse({ status: 200, description: 'Room type updated successfully' })
    @ApiResponse({ status: 404, description: 'Room type not found' })
    @ApiResponse({ status: 409, description: 'Room type name already exists' })
    async updateRoomType(
      @Param('id') id: number, 
      @Body() data: UpdateRoomTypeDto
    ): Promise<RoomTypeModel> {
      return this.roomTypeService.updateRoomType(id, data);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a room type' })
    @ApiResponse({ status: 200, description: 'Room type deleted successfully' })
    @ApiResponse({ status: 404, description: 'Room type not found' })
    @HttpCode(HttpStatus.OK)
    async deleteRoomType(@Param('id') id: number): Promise<boolean> {
      return this.roomTypeService.deleteRoomType(id);
    }
  }