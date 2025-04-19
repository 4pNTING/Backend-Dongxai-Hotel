// src/application/dtos/room-type.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateRoomTypeDto {
  @ApiProperty({ example: 'Standard Room', description: 'Name of the room type' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  TypeName: string;
}

export class UpdateRoomTypeDto extends PartialType(CreateRoomTypeDto) {}