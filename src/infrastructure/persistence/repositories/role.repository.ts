// src/infrastructure/persistence/repositories/role.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';
import { QueryDto } from '@application/common/query.dto';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.find();
  }
  // Removed duplicate query method implementation

  async findById(id: number): Promise<RoleEntity | null> {
    return this.roleRepository.findOne({
      where: { id }
    });
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    return this.roleRepository.findOne({
      where: { name }
    });
  }

  async create(roleData: Partial<RoleEntity>): Promise<RoleEntity> {
    const role = this.roleRepository.create({
      ...roleData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return this.roleRepository.save(role);
  }

  async update(id: number, roleData: Partial<RoleEntity>): Promise<RoleEntity | null> {
    await this.roleRepository.update(id, {
      ...roleData,
      updatedAt: new Date()
    });

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.roleRepository.delete(id);
    return result.affected > 0;
  }

  async query(queryDto: QueryDto): Promise<RoleEntity | RoleEntity[]> {
    const { filter, select, getType } = queryDto;
    
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    
    // จัดการ filter
    if (filter) {
      Object.keys(filter).forEach((key, index) => {
        const paramName = `param${index}`;
        if (typeof filter[key] === 'string') {
          queryBuilder.andWhere(`role.${key} LIKE :${paramName}`, { [paramName]: `%${filter[key]}%` });
        } else {
          queryBuilder.andWhere(`role.${key} = :${paramName}`, { [paramName]: filter[key] });
        }
      });
    }
    
    // จัดการ select
    if (select && select.length > 0) {
      queryBuilder.select(select.map(field => `role.${field}`));
    }
    
    // ส่งคืนผลลัพธ์ตามประเภทที่ต้องการ
    if (getType === 'one') {
      return queryBuilder.getOne();
    }
    
    return queryBuilder.getMany();
  }
}