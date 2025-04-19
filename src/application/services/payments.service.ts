// src/application/services/payment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from '../../infrastructure/persistence/repositories/payment.repository';
import { QueryDto } from '../common/query.dto';
import { PaymentModel } from '../../core/domain/models/payment.model';
import { CreatePaymentDto, UpdatePaymentDto } from '../dtos/payment.dto';
import { PaymentServicePort } from '../ports/payment.port';

@Injectable()
export class PaymentService implements PaymentServicePort {
  constructor(private paymentRepository: PaymentRepository) {}

  async query(dto: QueryDto): Promise<PaymentModel | PaymentModel[]> {
    if (dto.getType === 'one' && dto.filter && dto.filter.id) {
      const payment = await this.paymentRepository.findById(dto.filter.id);
      if (!payment) {
        throw new NotFoundException(`Payment with ID ${dto.filter.id} not found`);
      }
      return payment;
    }
    return this.paymentRepository.findAll(dto);
  }

  async create(dto: CreatePaymentDto): Promise<PaymentModel> {
    return this.paymentRepository.create(dto);
  }

  async update(id: number, dto: UpdatePaymentDto): Promise<boolean> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    await this.paymentRepository.update(id, dto);
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return this.paymentRepository.delete(id);
  }



 

}