// src/application/ports/staff.port.ts
import { StaffModel } from '../../core/domain/models/staff.model';
import { CreateStaffDto, UpdateStaffDto } from '../dtos/staff.dto';
import { QueryDto } from '../common/query.dto';

export interface StaffServicePort {
  query(dto: QueryDto): Promise<StaffModel | StaffModel[]>;
  create(dto: CreateStaffDto): Promise<StaffModel>;
  update(id: number, dto: UpdateStaffDto): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  findByUsername(userName: string): Promise<StaffModel | null>;
  // findByEmail(email: string): Promise<StaffModel | null>;
  // changePassword(id: number, currentPassword: string, newPassword: string): Promise<boolean>;
  // toggleActive(id: number): Promise<boolean>;
}