// src/application/ports/payment.port.ts
import { QueryDto } from '../common/query.dto';
import { PaymentModel } from '../../core/domain/models/payment.model';
import { CreatePaymentDto, UpdatePaymentDto } from '../dtos/payment.dto';

export interface PaymentServicePort {
  query(dto: QueryDto): Promise<PaymentModel | PaymentModel[]>;
  create(dto: CreatePaymentDto): Promise<PaymentModel>;
  update(id: number, dto: UpdatePaymentDto): Promise<boolean>;
  delete(id: number): Promise<boolean>;
 
}