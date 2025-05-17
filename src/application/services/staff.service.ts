// src/application/services/staff.service.ts
import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { StaffRepository } from '../../infrastructure/persistence/repositories/staff.repository';
import { QueryDto } from '../common/query.dto';
import { StaffModel } from '../../core/domain/models/staff.model';
import { CreateStaffDto, UpdateStaffDto } from '../dtos/staff.dto';
import { StaffServicePort } from '../ports/staff.port';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffService implements StaffServicePort {
  constructor(private staffRepository: StaffRepository) {}

  async query(dto: QueryDto): Promise<StaffModel | StaffModel[]> {
    if (dto.getType === 'one' && dto.filter && dto.filter.id) {
      const staff = await this.staffRepository.findById(dto.filter.id);
      if (!staff) {
        throw new NotFoundException(`Staff with ID ${dto.filter.id} not found`);
      }
      return staff;
    }
    return this.staffRepository.findAll(dto);
  }

  async create(dto: CreateStaffDto): Promise<StaffModel> {
    const existingByUserName = await this.staffRepository.findByUsername(dto.userName);
    if (existingByUserName) {
      throw new ConflictException(`Username ${dto.userName} is already taken`);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // Create new staff with hashed password
    return this.staffRepository.create({
      ...dto,
      password: hashedPassword
    });
  }

  async update(id: number, dto: UpdateStaffDto): Promise<boolean> {
    // ลบ this.logger.log ออกจากบรรทัดนี้
    
    const staff = await this.staffRepository.findById(id);
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }
    
    // Check if username is being updated and is already taken
    if (dto.userName && dto.userName !== staff.userName) {
      const existingByUserName = await this.staffRepository.findByUsername(dto.userName);
      if (existingByUserName && existingByUserName.StaffId !== Number(id)) {
        throw new ConflictException(`Username ${dto.userName} is already taken`);
      }
    }
    
    // Hash password if it's being updated
    let dataToUpdate = { ...dto };
    if (dto.password && dto.password !== '**UNCHANGED**') {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      dataToUpdate = {
        ...dataToUpdate,
        password: hashedPassword
      };
    } else if (dto.password === '**UNCHANGED**') {
      // ลบ password ออกเพื่อไม่ให้อัปเดต
      delete dataToUpdate.password;
    }
    
    await this.staffRepository.update(id, dataToUpdate);
    // ลบ this.logger.log ออกจากบรรทัดนี้ด้วย
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const staff = await this.staffRepository.findById(id);
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }
    return this.staffRepository.delete(id);
  }

  async findByUsername(username: string): Promise<StaffModel | null> {
    return this.staffRepository.findByUsername(username);
  }

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<boolean> {
    const staff = await this.staffRepository.findById(id, true);
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, staff.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await this.staffRepository.update(id, { password: hashedPassword });
    return true;
  }
}