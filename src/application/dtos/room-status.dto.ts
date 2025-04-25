// src/application/dtos/room-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateRoomStatusDto {
  @ApiProperty({ example: 'Available', description: 'Room status name' })
  @IsNotEmpty()
  @IsString()
  StatusName: string;
}

export class UpdateRoomStatusDto extends PartialType(CreateRoomStatusDto) {}

export class RoomStatusResponseDto {
  @ApiProperty({ example: 1 })
  StatusId: number;

  @ApiProperty({ example: 'Available' })
  StatusName: string;
}