
import { Inject, Injectable } from '@nestjs/common';
import { QueryDto } from '../common/query.dto';
import { CheckInServicePort } from '../ports/check-in.port';
import { CheckInModel } from '../../core/domain/models/check-in.model';
import { CreateCheckInDto, UpdateCheckInDto } from '../dtos/check-in.dto';

@Injectable()
export class CheckInUseCase {
  constructor(
    @Inject('CheckInServicePort')
    private readonly service: CheckInServicePort
  ) {}

  async query(dto: QueryDto): Promise<CheckInModel | CheckInModel[]> {
    return this.service.query(dto);
  }

  async create(dto: CreateCheckInDto): Promise<CheckInModel> {
    return this.service.create(dto);
  }

  async update(id: number, dto: UpdateCheckInDto): Promise<boolean> {
    return this.service.update(id, dto);
  }

  async delete(id: number): Promise<boolean> {
    return this.service.delete(id);
  }
}
