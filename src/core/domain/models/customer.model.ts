// src/core/domain/models/customer.model.ts
export class CustomerModel {
  CustomerId: number;
  CustomerName: string;
  CustomerGender: string;
  CustomerTel: string | number;
  CustomerPostcode: number | null;
  CustomerAddress: string;
  userName: string;
  password: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  roleId: number;
}