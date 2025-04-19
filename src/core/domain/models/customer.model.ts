// src/core/domain/models/customer.model.ts
export class CustomerModel {
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

  constructor(params?: Partial<CustomerModel>) {
    if (params) {
      // แยก fullName ออกจาก params เพื่อป้องกันการพยายามกำหนดค่าให้ fullName
      const { fullName, ...rest } = params as any;
      Object.assign(this, rest);
    }
  }
  
  // เพิ่มเมธอด getFullName แทนการใช้ getter
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}