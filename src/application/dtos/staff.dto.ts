// src/application/dtos/staff.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { RoleDto } from './role.dto';

export class CreateStaffDto {
  @ApiProperty({ example: 'Jane' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Smith' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'jane.smith@hotel.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: 'Manager' })
  @IsNotEmpty()
  @IsString()
  position: string;

  roleId: number;
  role?: RoleDto;

  @ApiProperty({ example: 'Front Desk', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: 'jsmith' })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
  
  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateStaffDto extends PartialType(CreateStaffDto) {}

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