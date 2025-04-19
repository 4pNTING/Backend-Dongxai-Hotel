import { QueryDto } from '../common/query.dto';
import { CheckOutModel } from '../../core/domain/models/check-out.model';
import { CreateCheckOutDto, UpdateCheckOutDto } from '../dtos/check-out.dto';

export interface CheckOutServicePort {
  query(dto: QueryDto): Promise<CheckOutModel | CheckOutModel[]>;
  create(dto: CreateCheckOutDto): Promise<CheckOutModel>;
  update(id: number, dto: UpdateCheckOutDto): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}