// src/infrastructure/config/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { StaffRepository } from '../persistence/repositories/staff.repository';
import { CustomerRepository } from '../persistence/repositories/customer.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly staffRepository: StaffRepository,
    private readonly customerRepository: CustomerRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')
    });
  }

  async validate(payload: any) {
    // ตรวจสอบว่ามี type ใน payload หรือไม่
    // ถ้าไม่มี type (กรณีโทเค็นเก่า) ให้ถือว่าเป็น staff
    const userType = payload.type || 'staff';
    
    try {
      if (userType === 'staff') {
        // ค้นหาข้อมูล staff จาก id
        const staff = await this.staffRepository.findById(payload.sub);
        if (!staff) {
          throw new UnauthorizedException('Invalid token - Staff not found');
        }
        return { 
          id: staff.StaffId,
          userName: staff.userName,
          role: payload.role || 'user',
          type: 'staff',
          roleId: staff.roleId
        };
      } else if (userType === 'customer') {
        // ค้นหาข้อมูล customer จาก id
        const customer = await this.customerRepository.findById(payload.sub);
        if (!customer) {
          throw new UnauthorizedException('Invalid token - Customer not found');
        }
        return { 
          id: customer.CustomerId,
          userName: customer.userName,
          role: 'customer',
          type: 'customer',
          roleId: customer.roleId || 2 // ค่าเริ่มต้นเป็น 2 สำหรับ customer
        };
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    // กรณีที่ type ไม่ถูกต้อง
    throw new UnauthorizedException('Invalid token type');
  }
}