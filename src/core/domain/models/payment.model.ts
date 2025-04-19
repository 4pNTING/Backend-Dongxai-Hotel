// src/core/domain/models/payment.model.ts
import { CheckOutEntity } from '../../../infrastructure/persistence/entities/check-out.entity';
import { StaffEntity } from '../../../infrastructure/persistence/entities/staff.entity';

export class PaymentModel {
  PaymentId: number;
  PaymentPrice: number;
  PaymentDate: Date;
  StaffId: number;
  CheckoutId: number;

  createdAt?: Date;
  updatedAt?: Date;

  checkOut?: CheckOutEntity;
  staff?: StaffEntity;

  constructor(params?: Partial<PaymentModel>) {
    if (params) {
      Object.assign(this, params);
    }
  }
}