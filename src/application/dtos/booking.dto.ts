// src/application/dtos/booking.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @ApiProperty({ example: '2023-09-15' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  BookingDate: Date;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  RoomId: number;

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
  GuestId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  StaffId: number;
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}