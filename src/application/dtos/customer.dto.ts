// src/application/dtos/customer.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'ສົມຈິດ ຈັນທະລິດ' })
  @IsNotEmpty()
  @IsString()
  CustomerName: string;

  @ApiProperty({ example: 'Female' })
  @IsNotEmpty()
  @IsString()
  CustomerGender: string;

  @ApiProperty({ example: 201234567 })
  @IsNotEmpty()
  @IsInt()
  CustomerTel: number;

  @ApiProperty({ example: '123 Main St, ນະຄອນຫຼວງ' })
  @IsNotEmpty()
  @IsString()
  CustomerAddress: string;

  @ApiProperty({ example: 10000 })
  @IsNotEmpty()
  @IsInt()
  CustomerPostcode: number;

  @ApiProperty({ example: 'somchai123' })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  password: string;     
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}

export class CustomerResponseDto extends CreateCustomerDto {
  @ApiProperty({ example: 1 })
  CustomerId: number;

  @ApiProperty({ example: '2025-04-09T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-04-09T12:00:00.000Z' })
  updatedAt: Date;
}
