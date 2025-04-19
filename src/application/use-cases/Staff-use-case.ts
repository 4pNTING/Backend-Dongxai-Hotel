// src/application/use-cases/staff.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { CreateStaffDto, UpdateStaffDto } from '../dtos/staff.dto';
import { StaffServicePort } from '../ports/staff.port';
import { StaffModel } from '../../core/domain/models/staff.model';
import { QueryDto } from '../common/query.dto';

@Injectable()
export class StaffUseCase {
  constructor(
    @Inject('StaffServicePort')
    private readonly staffService: StaffServicePort
  ) {}

  async create(dto: CreateStaffDto): Promise<StaffModel> {
    return this.staffService.create(dto);
  }

  async update(id: number, dto: UpdateStaffDto): Promise<boolean> {
    return this.staffService.update(id, dto);
  }

  async delete(id: number): Promise<boolean> {
    return this.staffService.delete(id);
  }

  async query(query: QueryDto): Promise<StaffModel | StaffModel[]> {
    if (query.getType === 'one' && query.filter?.id) {
      const staff = await this.staffService.query({
        filter: { id: query.filter.id },
        getType: 'one'
      });
      return staff;
    }
    return this.staffService.query(query);
  }

  async findByUsername(username: string): Promise<StaffModel | null> {
    return this.staffService.findByUsername(username);
  }

  // async changePassword(id: number, currentPassword: string, newPassword: string): Promise<boolean> {
  //   return this.staffService.changePassword(id, currentPassword, newPassword);
  // }

  // async toggleActive(id: number): Promise<boolean> {
  //   return this.staffService.toggleActive(id);
  // }
}