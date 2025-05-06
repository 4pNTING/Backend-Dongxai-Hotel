// src/application/dtos/auth.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
  
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;
  
  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;
  
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  @IsString()
  role: string;
}

export class TokenDto {
  @ApiProperty()
  accessToken: string;
  
  @ApiProperty()
  refreshToken: string;
  
  @ApiProperty()
  expiresIn: number;
 
  @ApiProperty({
    description: 'User information',
    example: {
      id: 1,
      userName: 'admin',
      role: 'admin',
      roleId: 1,
      type: 'staff'
    }
  })
  user?: {
    id: number;
    userName: string;
    role: string;
    roleId?: number;
    type: string; // เพิ่มฟิลด์ type เพื่อระบุประเภทผู้ใช้ (staff หรือ customer)
  };
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}