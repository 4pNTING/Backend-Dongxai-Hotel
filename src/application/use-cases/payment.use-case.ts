// src/application/use-cases/payment.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { QueryDto } from '../common/query.dto';
import { PaymentServicePort } from '../ports/payment.port';
import { PaymentModel } from '../../core/domain/models/payment.model';
import { CreatePaymentDto, UpdatePaymentDto } from '../dtos/payment.dto';

@Injectable()
export class PaymentUseCase {
  constructor(
    @Inject('PaymentServicePort')
    private readonly service: PaymentServicePort
  ) {}

  async query(dto: QueryDto): Promise<PaymentModel | PaymentModel[]> {
    return this.service.query(dto);
  }

  async create(dto: CreatePaymentDto): Promise<PaymentModel> {
    return this.service.create(dto);
  }

  async update(id: number, dto: UpdatePaymentDto): Promise<boolean> {
    return this.service.update(id, dto);
  }

  async delete(id: number): Promise<boolean> {
    return this.service.delete(id);
  }
  
  // async getPaymentsByCheckout(checkoutId: string): Promise<PaymentModel[]> {
  //   return this.service.getPaymentsByCheckout(checkoutId);
  // }
  
  // async calculateTotal(checkoutId: string): Promise<number> {
  //   return this.service.calculateTotal(checkoutId);
  // }
}