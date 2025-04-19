import { Inject, Injectable } from '@nestjs/common';
import { QueryDto } from '../common/query.dto';
import { CancellationServicePort } from '../ports/cancellation.port';
import { CancellationModel } from '../../core/domain/models/cancellation.model';
import { CreateCancellationDto, UpdateCancellationDto } from '../dtos/cancellation.dto';

@Injectable()
export class CancellationUseCase {
  constructor(
    @Inject('CancellationServicePort')
    private readonly service: CancellationServicePort
  ) {}

  async query(dto: QueryDto): Promise<CancellationModel | CancellationModel[]> {
    return this.service.query(dto);
  }

  async create(dto: CreateCancellationDto): Promise<CancellationModel> {
    return this.service.create(dto);
  }

  async update(id: number, dto: UpdateCancellationDto): Promise<boolean> {
    return this.service.update(id, dto);
  }

  async delete(id: number): Promise<boolean> {
    return this.service.delete(id);
  }
}