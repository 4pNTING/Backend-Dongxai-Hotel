// src/application/dtos/room.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ example: 'STD' })
  @IsNotEmpty()
  @IsString()
  RoomType: string;

  @ApiProperty({ example: 'Available' })
  @IsNotEmpty()
  @IsString()
  RoomStatus: string;

  @ApiProperty({ example: 1500.50 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  RoomPrice: number;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}