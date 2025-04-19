// src/application/services/customer.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '../../infrastructure/persistence/repositories/customer.repository';
import { QueryDto } from '../common/query.dto';
import { CustomerModel } from '../../core/domain/models/customer.model';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';
import { CustomerServicePort } from '../ports/customer.port';

@Injectable()
export class CustomerService implements CustomerServicePort {
  constructor(private customerRepository: CustomerRepository) {}

  async query(dto: QueryDto): Promise<CustomerModel | CustomerModel[]> {
    if (dto.getType === 'one' && dto.filter && dto.filter.id) {
      // ตรวจสอบว่าเป็น string หรือ number แล้วแปลงให้เป็น number
      const id = typeof dto.filter.id === 'string' ? Number(dto.filter.id) : dto.filter.id;
      const customer = await this.customerRepository.findById(id);
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      return customer;
    }
    return this.customerRepository.findAll(dto);
  }

  async create(dto: CreateCustomerDto): Promise<CustomerModel> {
    return this.customerRepository.create(dto);
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<boolean> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    await this.customerRepository.update(id, dto);
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return this.customerRepository.delete(id);
  }


}