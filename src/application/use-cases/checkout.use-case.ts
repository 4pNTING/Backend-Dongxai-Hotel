import { Inject, Injectable } from '@nestjs/common';
import { QueryDto } from '../common/query.dto';
import { CheckOutServicePort } from '../ports/check-out.port';
import { CheckOutModel } from '../../core/domain/models/check-out.model';
import { CreateCheckOutDto, UpdateCheckOutDto } from '../dtos/check-out.dto';

@Injectable()
export class CheckOutUseCase {
  constructor(
    @Inject('CheckOutServicePort')
    private readonly service: CheckOutServicePort
  ) {}

  async query(dto: QueryDto): Promise<CheckOutModel | CheckOutModel[]> {
    return this.service.query(dto);
  }

  async create(dto: CreateCheckOutDto): Promise<CheckOutModel> {
    return this.service.create(dto);
  }

  async update(id: number, dto: UpdateCheckOutDto): Promise<boolean> {
    return this.service.update(id, dto);
  }

  async delete(id: number): Promise<boolean> {
    return this.service.delete(id);
  }
}