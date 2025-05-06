// src/core/domain/models/customer.model.ts
export class CustomerModel {
  // ฟิลด์เดิม
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
  phoneNumber?: string;
  address?: string;
  postcode?: number;
  createdAt: Date;
  updatedAt: Date;

  // เพิ่มฟิลด์ใหม่สำหรับ authentication
  CustomerId: number; // เพิ่มฟิลด์นี้เพื่อให้สอดคล้องกับ Entity
  userName: string; // เพิ่มฟิลด์สำหรับ login
  password?: string; // เพิ่มฟิลด์สำหรับ login
  roleId?: number; // เพิ่มฟิลด์สำหรับกำหนดสิทธิ์
}