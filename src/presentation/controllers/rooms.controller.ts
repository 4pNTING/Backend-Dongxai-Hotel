import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoomDto, UpdateRoomDto } from '../../application/dtos/room.dto';
import { QueryDto } from '../../application/common/query.dto';
import { RoomUseCase } from '../../application/use-cases/room.use-case';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { METADATA_KEY } from '../../core/constants/metadata.constant';
import { Public } from '../../core/decorators/public.decorator';

@ApiTags(METADATA_KEY.API_TAG.ROOM)
@Controller('rooms')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoomController {
  constructor(
    private readonly roomUseCase: RoomUseCase
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  async findAll(@Query() query: QueryDto) {
    return this.roomUseCase.query({ ...query, getType: 'many' });
  }

  @Public()
  @Get('available')
  @ApiOperation({ summary: 'Get available rooms' })
  async findAvailable(@Query('checkInDate') checkInDate: string, @Query('checkOutDate') checkOutDate: string) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    return this.roomUseCase.findAvailableRooms(checkIn, checkOut);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  async findOne(@Param('id') id: number) {
    return this.roomUseCase.query({ 
      filter: { id }, 
      getType: 'one' 
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomUseCase.create(createRoomDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a room' })
  async update(@Param('id') id: number, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomUseCase.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a room' })
  async remove(@Param('id') id: number): Promise<boolean> {
    return this.roomUseCase.delete(id);
  }

  @Post('query')
  @ApiOperation({ summary: 'Advanced room query' })
  async query(@Body() query: QueryDto) {
    return this.roomUseCase.query({ ...query, getType: 'many' });
  }
}