// src/application/ports/cancellation.port.ts
import { QueryDto } from '../common/query.dto';
import { CancellationModel } from '../../core/domain/models/cancellation.model';
import { CreateCancellationDto, UpdateCancellationDto } from '../dtos/cancellation.dto';

export interface CancellationServicePort {
  query(dto: QueryDto): Promise<CancellationModel | CancellationModel[]>;
  create(dto: CreateCancellationDto): Promise<CancellationModel>;
  update(id: number, dto: UpdateCancellationDto): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}