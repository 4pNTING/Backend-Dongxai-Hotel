// src/application/dtos/booking.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate, IsString, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BookingStatusEnum  } from '@core/enum/BookingStatus';

export class CreateBookingDto {
  @ApiProperty({ example: '2023-09-01' })
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

  @ApiProperty({ 
    example: 'Confirmed',
    enum: BookingStatusEnum ,
    description: 'Booking status (Confirmed, Pending, Cancelled, etc.)' 
  })
  @IsNotEmpty()
  @IsEnum(BookingStatusEnum)
  BookingStatus: BookingStatusEnum ;
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}