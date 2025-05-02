// src/application/dtos/staff.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  StaffName: string;

  @ApiProperty({ example: 'MALE' })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({ example: 1234567890 })
  @IsNotEmpty()
  @IsNumber()
  tel: number;

  @ApiProperty({ example: '123 Main St' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'johndoe' })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({ example: 5000000 })
  @IsNotEmpty()
  @IsNumber()
  salary: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateStaffDto {
  @ApiProperty({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  StaffName?: string;

  @ApiProperty({ example: 'MALE' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: 1234567890 })
  @IsOptional()
  @IsNumber()
  tel?: number;

  @ApiProperty({ example: '123 Main St' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'johndoe' })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiProperty({ example: 5000000 })
  @IsOptional()
  @IsNumber()
  salary?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @ApiProperty({ example: 'password123' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}