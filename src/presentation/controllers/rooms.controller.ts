import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { QueryDto } from "../../application/common/query.dto";
import { CreateRoomDto, UpdateRoomDto } from "../../application/dtos/room.dto";
import { RoomUseCase } from "../../application/use-cases/room.use-case";
import { RoomModel } from "../../core/domain/models/room.model";

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomUseCase: RoomUseCase) {}

  @Post('query')
  @HttpCode(HttpStatus.OK)
  async find(@Body() dto: QueryDto): Promise<RoomModel | RoomModel[]> {
    return this.roomUseCase.query(dto);
  }

  @Post('create')
  async create(@Body() dto: CreateRoomDto): Promise<RoomModel> {
    return this.roomUseCase.create(dto);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoomDto): Promise<boolean> {
    return this.roomUseCase.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.roomUseCase.delete(id);
  }
}