// src/core/domain/models/staff.model.ts
import { RoleModel } from './role.model'; // Make sure to import the RoleModel

export class StaffModel {
  id: number;
  name: string;
  gender: string;
  tel: number;
  address: string;
  userName: string;
  password?: string;
  position: string;
  salary: number;
  roleId?: number;
  role?: RoleModel; // Properly typed role property
  createdAt: Date;
  updatedAt: Date;
}