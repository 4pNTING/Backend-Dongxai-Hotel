import { Inject, Injectable } from '@nestjs/common';
import { QueryDto } from '../common/query.dto';
import { EmployeeServicePort } from '../ports/employee.port';
import { EmployeeModel } from '../../core/domain/models/employee.model';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dtos/employee.dto';

@Injectable()
export class EmployeeUseCase {
  constructor(
    @Inject('EmployeeServicePort')
    private readonly service: EmployeeServicePort
  ) {}

  async query(dto: QueryDto): Promise<EmployeeModel | EmployeeModel[]> {
    return this.service.query(dto);
  }

  async create(dto: CreateEmployeeDto): Promise<EmployeeModel> {
    return this.service.create(dto);
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<boolean> {
    return this.service.update(id, dto);
  }

  async delete(id: number): Promise<boolean> {
    return this.service.delete(id);
  }
}