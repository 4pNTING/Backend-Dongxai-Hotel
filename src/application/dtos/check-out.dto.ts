// src/application/dtos/check-out.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCheckOutDto {
  @ApiProperty({ example: '2023-09-20' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  CheckoutDate: Date;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  CheckinId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  RoomId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  StaffId: number;
}

export class UpdateCheckOutDto extends PartialType(CreateCheckOutDto) {}