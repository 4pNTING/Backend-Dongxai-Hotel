// src/application/use-cases/customer.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { QueryDto } from '../common/query.dto';
import { CustomerServicePort } from '../ports/customer.port';
import { CustomerModel } from '../../core/domain/models/customer.model';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';

@Injectable()
export class CustomerUseCase {
  constructor(
    @Inject('CustomerServicePort')
    private readonly service: CustomerServicePort
  ) {}

  async query(dto: QueryDto): Promise<CustomerModel | CustomerModel[]> {
    return this.service.query(dto);
  }

  async create(dto: CreateCustomerDto): Promise<CustomerModel> {
    return this.service.create(dto);
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<boolean> {
    return this.service.update(id, dto);
  }

  async delete(id: number): Promise<boolean> {
    return this.service.delete(id);
  }
}