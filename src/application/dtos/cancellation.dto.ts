// src/application/dtos/cancellation.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCancellationDto {
  @ApiProperty({ example: '2023-09-15' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  CancelDate: Date;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  StaffId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  BookingId: number;
}

export class UpdateCancellationDto extends PartialType(CreateCancellationDto) {}