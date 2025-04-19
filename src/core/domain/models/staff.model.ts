// src/core/domain/models/staff.model.ts
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
  role?: any; // หรือกำหนดเป็น RoleModel ที่เหมาะสม
  createdAt: Date;
  updatedAt: Date;
}