
import { QueryDto } from '../common/query.dto';
import { CheckInModel } from '../../core/domain/models/check-in.model';
import { CreateCheckInDto, UpdateCheckInDto } from '../dtos/check-in.dto';

export interface CheckInServicePort {
  query(dto: QueryDto): Promise<CheckInModel | CheckInModel[]>;
  create(dto: CreateCheckInDto): Promise<CheckInModel>;
  update(id: number, dto: UpdateCheckInDto): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}