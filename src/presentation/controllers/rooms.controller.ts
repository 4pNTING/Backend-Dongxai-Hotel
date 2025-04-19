import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRoomDto, UpdateRoomDto } from '../../application/dtos/room.dto';
import { QueryDto } from '../../application/common/query.dto';
import { RoomUseCase } from '../../application/use-cases/room.use-case';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { METADATA_KEY } from '../../core/constants/metadata.constant';

@ApiTags(METADATA_KEY.API_TAG.ROOM)
@Controller('rooms')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoomController {
  constructor(
    private readonly roomUseCase: RoomUseCase
  ) {}

  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.roomUseCase.query({ ...query, getType: 'many' });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.roomUseCase.query({ 
      filter: { id }, 
      getType: 'one' 
    });
  }

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomUseCase.create(createRoomDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomUseCase.update(id, updateRoomDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<boolean> {
    return this.roomUseCase.delete(id);
  }
}