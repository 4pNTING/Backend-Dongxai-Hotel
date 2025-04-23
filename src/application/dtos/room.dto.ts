// src/application/dtos/room.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ example: 1, description: 'Room type ID' })
  @IsNotEmpty()
  @IsNumber()
  TypeId: number;

  @ApiProperty({ example: 1, description: 'Room status ID' })
  @IsNotEmpty()
  @IsNumber()
  StatusId: number;

  @ApiProperty({ example: 1500.50, description: 'Room price' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  RoomPrice: number;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}

// DTO สำหรับการตอบกลับ
export class RoomResponseDto {
  @ApiProperty({ example: 1 })
  RoomId: number;

  @ApiProperty({ example: 1 })
  TypeId: number;

  @ApiProperty({ example: 1 })
  StatusId: number;

  @ApiProperty({ example: 1500.50 })
  RoomPrice: number;

  @ApiProperty({ 
    example: { 
      TypeId: 1, 
      TypeName: 'Standard' 
    } 
  })
  roomType?: {
    TypeId: number;
    TypeName: string;
  };

  @ApiProperty({ 
    example: { 
      StatusId: 1, 
      StatusName: 'Available' 
    } 
  })
  roomStatus?: {
    StatusId: number;
    StatusName: string;
  };
}