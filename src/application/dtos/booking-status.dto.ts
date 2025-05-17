// src/application/dtos/booking-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateBookingStatusDto {
  @ApiProperty({ example: 'ລໍຖ້າການຢືນຢັນ', description: 'Booking status name' })
  @IsNotEmpty()
  @IsString()
  StatusName: string;

  @ApiProperty({ 
    example: 'ການຈອງທີ່ລໍຖ້າການກວດສອບແລະຢືນຢັນຈາກພະນັກງານ', 
    description: 'Booking status description',
    required: false
  })
  @IsOptional()
  @IsString()
  StatusDescription?: string;
}

export class UpdateBookingStatusDto extends PartialType(CreateBookingStatusDto) {}

export class BookingStatusResponseDto {
  @ApiProperty({ example: 1 })
  StatusId: number;

  @ApiProperty({ example: 'ລໍຖ້າການຢືນຢັນ' })
  StatusName: string;

  @ApiProperty({ example: 'ການຈອງທີ່ລໍຖ້າການກວດສອບແລະຢືນຢັນຈາກພະນັກງານ' })
  StatusDescription?: string;
}