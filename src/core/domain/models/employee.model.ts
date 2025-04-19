export class EmployeeModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  hireDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // ใช้ getter อย่างเดียวเพื่อคำนวณชื่อเต็ม
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(params?: Partial<EmployeeModel>) {
    if (params) {
      Object.assign(this, params);
    }
  }
}