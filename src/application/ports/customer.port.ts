// src/application/ports/customer.port.ts
import { QueryDto } from '../common/query.dto';
import { CustomerModel } from '../../core/domain/models/customer.model';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';

export interface CustomerServicePort {
  query(dto: QueryDto): Promise<CustomerModel | CustomerModel[]>;
  create(dto: CreateCustomerDto): Promise<CustomerModel>;
  update(id: number, dto: UpdateCustomerDto): Promise<boolean>; 
  delete(id: number): Promise<boolean>; 

}