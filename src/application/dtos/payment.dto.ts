// src/application/dtos/payment.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({ example: 1500.00 })
  @IsNotEmpty()
  @IsNumber()
  PaymentPrice: number;

  @ApiProperty({ example: '2023-09-20' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  PaymentDate: Date;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  StaffId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  CheckoutId: number;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}

// Keep the PaymentMethod enum if you want to use it elsewhere
export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  ONLINE_PAYMENT = 'ONLINE_PAYMENT',
}