import { QueryDto } from '../common/query.dto';
import { EmployeeModel } from '../../core/domain/models/employee.model';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dtos/employee.dto';

export interface EmployeeServicePort {
  query(dto: QueryDto): Promise<EmployeeModel | EmployeeModel[]>;
  create(dto: CreateEmployeeDto): Promise<EmployeeModel>;
  update(id: number, dto: UpdateEmployeeDto): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}