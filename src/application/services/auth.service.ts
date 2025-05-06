// src/application/services/auth.service.ts
import { Injectable, UnauthorizedException, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StaffRepository } from '../../infrastructure/persistence/repositories/staff.repository';
import { RefreshTokenRepository } from '../../infrastructure/persistence/repositories/refresh-token.repository';
import { LoginDto, RefreshTokenDto, RegisterDto, TokenDto } from '../dtos/auth.dto';
import { AuthServicePort } from '../ports/auth.port';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'; 
import { CustomerRepository } from '../../infrastructure/persistence/repositories/customer.repository';

@Injectable()
export class AuthService implements AuthServicePort {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<TokenDto> {
    this.logger.debug(`Attempting login for user: ${dto.userName}`);

    // กำหนดค่าเริ่มต้น
    let user = null;
    let userType = '';
    
    // ค้นหาใน staff ก่อน
    const staff = await this.staffRepository.findByUsername(dto.userName);
    if (staff) {
      const isPasswordValid = await bcrypt.compare(dto.password, staff.password);
      if (isPasswordValid) {
        user = staff;
        userType = 'staff';
      }
    }
    
    // ถ้าไม่พบใน staff ให้ค้นหาใน customer
    if (!user) {
      const customer = await this.customerRepository.findByUsername(dto.userName);
      if (customer) {
        const isPasswordValid = await bcrypt.compare(dto.password, customer.password);
        if (isPasswordValid) {
          user = customer;
          userType = 'customer';
        }
      }
    }
    
    // ถ้าไม่พบผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
    if (!user) {
      this.logger.warn(`Login failed - Invalid credentials for user: ${dto.userName}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.debug(`Login successful for ${userType}: ${dto.userName}`);
    
    // รีโวคโทเค็นเก่าทั้งหมดของผู้ใช้
    if (userType === 'staff') {
      await this.refreshTokenRepository.revokeAllUserTokens(user.StaffId);
    } else {
      await this.refreshTokenRepository.revokeAllUserTokens(user.CustomerId);
    }
    
    // สร้างโทเค็นใหม่
    return this.generateTokens(user, userType);
  }

  async validateUser(userName: string, password: string): Promise<any> {
    this.logger.debug(`Validating user: ${userName}`);
    
    // ตรวจสอบ staff ก่อน
    const staff = await this.staffRepository.findByUsername(userName, true);
    if (staff && staff.password) {
      const isPasswordValid = await bcrypt.compare(password, staff.password);
      if (isPasswordValid) {
        this.logger.debug(`Validation successful for staff: ${userName}`);
        const { password: _, ...result } = staff;
        return { ...result, type: 'staff' };
      }
    }
    
    // ถ้าไม่พบใน staff ให้ตรวจสอบใน customer
    const customer = await this.customerRepository.findByUsername(userName, true);
    if (customer && customer.password) {
      const isPasswordValid = await bcrypt.compare(password, customer.password);
      if (isPasswordValid) {
        this.logger.debug(`Validation successful for customer: ${userName}`);
        const { password: _, ...result } = customer;
        return { ...result, type: 'customer' };
      }
    }
    
    this.logger.warn(`Validation failed for user: ${userName}`);
    return null;
  }

  async register(dto: RegisterDto): Promise<TokenDto> {
    this.logger.debug(`Attempting registration for user: ${dto.userName}`);
    
    // ตรวจสอบว่า username ซ้ำหรือไม่ ทั้งใน staff และ customer
    const existingStaff = await this.staffRepository.findByUsername(dto.userName);
    const existingCustomer = await this.customerRepository.findByUsername(dto.userName);
    
    if (existingStaff || existingCustomer) {
      this.logger.warn(`Registration failed - Username already exists: ${dto.userName}`);
      throw new UnauthorizedException('Username already exists');
    }
    
    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    try {
      // ในตัวอย่างนี้ เราจะสร้าง staff เป็นค่าเริ่มต้น
      // สามารถเพิ่มพารามิเตอร์เพื่อกำหนดว่าจะสร้าง staff หรือ customer ได้
      const staffData = {
        userName: dto.userName,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: `${dto.userName}@example.com`,
        isActive: true
      };
    
      const createData = {
        ...staffData,
        StaffName: `${dto.firstName} ${dto.lastName}`,
        gender: 'UNKNOWN',
        tel: 0,
        address: ''
      } as any;
    
      const staff = await this.staffRepository.create(createData);
      
      this.logger.debug(`Registration successful for user: ${dto.userName}`);
      
      // สร้างทั้ง access token และ refresh token
      return this.generateTokens(staff, 'staff');
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
      
      // ตรวจสอบประเภทผู้ใช้จาก payload
      const userType = payload.type || 'staff';
      let user;
      
      if (userType === 'staff') {
        // หาข้อมูล staff จาก ID ใน payload
        user = await this.staffRepository.findById(payload.sub);
      } else {
        // หาข้อมูล customer จาก ID ใน payload
        user = await this.customerRepository.findById(payload.sub);
      }
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      // สร้างโทเค็นใหม่
      return this.generateTokens(user, userType);
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
  private async generateTokens(user: any, userType: string): Promise<TokenDto> {
    let id, role, roleId;
    
    if (userType === 'staff') {
      id = user.StaffId;
      role = (user.role?.name || 'user').toLowerCase();
      roleId = user.roleId;
      
      this.logger.debug(`Generating tokens for staff: ${user.userName}, ID: ${id}, Role: ${role}`);
    } else {
      id = user.CustomerId;
      role = 'customer';
      roleId = user.roleId || 2; // default roleId for customer
      
      this.logger.debug(`Generating tokens for customer: ${user.userName}, ID: ${id}, Role: ${role}`);
    }
    
    const accessTokenPayload = {
      sub: id,
      userName: user.userName,
      role: role,
      type: userType
    };
    
    const refreshTokenPayload = {
      sub: id,
      jti: uuidv4(),
      type: userType
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
      id,
      refreshToken,
      refreshTokenExpiresIn
    );
    
    return {
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiresIn,
      user: {
        id: id,
        userName: user.userName,
        role: role,
        roleId: roleId,
        type: userType
      }
    };
  }
}