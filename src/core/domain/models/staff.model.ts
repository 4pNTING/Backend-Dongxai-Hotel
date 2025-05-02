// src/core/domain/models/staff.model.ts
import { RoleModel } from './role.model'; // Make sure to import the RoleModel

export class StaffModel {
  StaffId: number;       // แก้ไขจาก id เป็น StaffId
  StaffName: string;     // แก้ไขจาก name เป็น StaffName
  gender: string;
  tel: number;
  address: string;
  userName: string;
  password?: string;

  salary: number;
  roleId?: number;
  role?: RoleModel;
  createdAt: Date;
  updatedAt: Date;
}