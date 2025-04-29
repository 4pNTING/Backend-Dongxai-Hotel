// src/application/services/auth.service.ts
import { Injectable, UnauthorizedException, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StaffRepository } from '../../infrastructure/persistence/repositories/staff.repository';
import { RefreshTokenRepository } from '../../infrastructure/persistence/repositories/refresh-token.repository';
import { LoginDto, RefreshTokenDto, RegisterDto, TokenDto } from '../dtos/auth.dto';
import { AuthServicePort } from '../ports/auth.port';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'; 

@Injectable()
export class AuthService implements AuthServicePort {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<TokenDto> {
    this.logger.debug(`Attempting login for user: ${dto.userName}`);
    
    const staff = await this.staffRepository.findByUsername(dto.userName);
    if (!staff) {
      this.logger.warn(`Login failed - User not found: ${dto.userName}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(dto.password, staff.password);
    if (!isPasswordValid) {
      this.logger.warn(`Login failed - Invalid password for user: ${dto.userName}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.debug(`Login successful for user: ${dto.userName}`);
    
    // รีโวคโทเค็นเก่าทั้งหมดของผู้ใช้ (optional - เปิดเมื่อต้องการให้เข้าสู่ระบบได้เพียงอุปกรณ์เดียวเท่านั้น)
     await this.refreshTokenRepository.revokeAllUserTokens(staff.id);
    
    // สร้างโทเค็นใหม่
    return this.generateTokens(staff);
  }

  async validateUser(userName: string, password: string): Promise<any> {
    this.logger.debug(`Validating user: ${userName}`);
    
    const staff = await this.staffRepository.findByUsername(userName, true);
    if (!staff) {
      this.logger.warn(`Validation failed - User not found: ${userName}`);
      return null;
    }
  
    if (!staff.password) {
      this.logger.warn(`Validation failed - Password not set for user: ${userName}`);
      return null;
    }
  
    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      this.logger.warn(`Validation failed - Invalid password for user: ${userName}`);
      return null;
    }
  
    this.logger.debug(`Validation successful for user: ${userName}`);
    const { password: _, ...result } = staff;
    return result;
  }

  async register(dto: RegisterDto): Promise<TokenDto> {
    this.logger.debug(`Attempting registration for user: ${dto.userName}`);
    
    const existingStaff = await this.staffRepository.findByUsername(dto.userName);
    if (existingStaff) {
      this.logger.warn(`Registration failed - Username already exists: ${dto.userName}`);
      throw new UnauthorizedException('Username already exists');
    }
  
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    try {
      const staffData = {
        userName: dto.userName,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        position: dto.role,
        email: `${dto.userName}@example.com`,
        isActive: true
      };
  
      const createData = {
        ...staffData,
        StaffName: `${dto.firstName} ${dto.lastName}`,
        Tel: 0,
        Address: ''
      } as any;
  
      const staff = await this.staffRepository.create(createData);
      
      this.logger.debug(`Registration successful for user: ${dto.userName}`);
      
      // สร้างทั้ง access token และ refresh token
      return this.generateTokens(staff);
    } catch (error) {
      this.logger.error(`Registration error for user ${dto.userName}: ${error.message}`, error.stack);
      throw error;
    }
  }
  
  async refreshToken(dto: RefreshTokenDto): Promise<TokenDto> {
    const { refreshToken } = dto;
    
    try {
      // ตรวจสอบความถูกต้องของ token ด้วย JWT เพื่อรับ payload
      const payload = this.jwtService.verify(refreshToken);
      
      // ค้นหา refresh token ในฐานข้อมูล
      const tokenEntity = await this.refreshTokenRepository.findByToken(refreshToken);
      if (!tokenEntity) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      // ตรวจสอบว่าโทเค็นหมดอายุหรือไม่
      if (new Date() > tokenEntity.expiresAt) {
        // รีโวคโทเค็นที่หมดอายุ
        await this.refreshTokenRepository.revokeToken(tokenEntity.id);
        throw new UnauthorizedException('Refresh token expired');
      }
      
      // รีโวคโทเค็นเก่า (one-time use)
      await this.refreshTokenRepository.revokeToken(tokenEntity.id);
      
      // หาข้อมูล staff จาก ID ใน payload
      const staff = await this.staffRepository.findById(payload.sub);
      if (!staff) {
        throw new UnauthorizedException('User not found');
      }
      
      // สร้างโทเค็นใหม่
      return this.generateTokens(staff);
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw error;
    }
  }
  
  async revokeRefreshToken(token: string): Promise<boolean> {
    try {
      const tokenEntity = await this.refreshTokenRepository.findByToken(token);
      if (!tokenEntity) {
        // แทนที่จะโยน exception ให้แค่บันทึกข้อความเตือนและส่งค่า false กลับ
        this.logger.warn(`Refresh token not found during logout attempt`);
        return false;
      }
      
      await this.refreshTokenRepository.revokeToken(tokenEntity.id);
      return true;
    } catch (error) {
      this.logger.error(`Error revoking token: ${error.message}`, error.stack);
      return false;
    }
  }
  
  // Helper function to generate tokens
  private async generateTokens(staff: any): Promise<TokenDto> {
    console.log('Staff in generateTokens:', {
      id: staff.id,
      userName: staff.userName,
      role: staff.role
    });
    
    // ประกาศตัวแปร role ก่อนใช้
    const role = (staff.role?.name || 'user').toLowerCase();
    
    const accessTokenPayload = {
      sub: staff.id,
      userName: staff.userName,
      role: role 
    };
    
    console.log('Access token payload:', accessTokenPayload);
    
    const refreshTokenPayload = {
      sub: staff.id,
      jti: uuidv4(),
    };
    
    // กำหนดเวลาหมดอายุ
    const accessTokenExpiresIn = 2 * 3600; // 2 hour
    const refreshTokenExpiresIn = 7 * 24 * 3600; // 7 days
    
    // สร้าง tokens
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: accessTokenExpiresIn,
    });
    
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: refreshTokenExpiresIn,
    });
    
    // บันทึก refresh token ลงฐานข้อมูล
    await this.refreshTokenRepository.createRefreshToken(
      staff.id,
      refreshToken,
      refreshTokenExpiresIn
    );
    
    return {
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiresIn,
      user: {
        id: staff.id,
        userName: staff.userName,
        role: role,
        roleId: staff.roleId
      }
    };
  }
}