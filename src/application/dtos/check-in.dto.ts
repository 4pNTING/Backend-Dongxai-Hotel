// src/application/dtos/check-in.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCheckInDto {
  @ApiProperty({ example: '2023-09-15' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  CheckinDate: Date;

  @ApiProperty({ example: '2023-09-20' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  CheckoutDate: Date;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  RoomId: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  BookingId?: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  GuestId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  StaffId: number;
}

export class UpdateCheckInDto extends PartialType(CreateCheckInDto) {}