// src/infrastructure/persistence/repositories/staff.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffEntity } from '../entities/staff.entity';
import { StaffModel } from '../../../core/domain/models/staff.model';
import { QueryDto } from '../../../application/common/query.dto';
import { CreateStaffDto, UpdateStaffDto } from '../../../application/dtos/staff.dto';

@Injectable()
export class StaffRepository {
  constructor(
    @InjectRepository(StaffEntity)
    private readonly staffRepository: Repository<StaffEntity>,
  ) { }

  async findAll(query: QueryDto): Promise<StaffModel[]> {
    const queryBuilder = this.staffRepository.createQueryBuilder('staff');

    // Apply select
    if (query.select && query.select.length > 0) {
      queryBuilder.select(query.select.map(field => `staff.${field}`));
    }

    // Apply relations
    if (query.relations && query.relations.length > 0) {
      query.relations.forEach(relation => {
        queryBuilder.leftJoinAndSelect(`staff.${relation}`, relation);
      });
    }

    // Apply filters
    if (query.filter) {
      Object.keys(query.filter).forEach(key => {
        queryBuilder.andWhere(`staff.${key} = :${key}`, { [key]: query.filter[key] });
      });
    }

    // Apply search
    if (query.search) {
      queryBuilder.andWhere(
        '(staff.firstName ILIKE :search OR staff.lastName ILIKE :search OR staff.email ILIKE :search OR staff.userName ILIKE :search)', // เปลี่ยนจาก username เป็น userName
        { search: `%${query.search}%` }
      );
    }

    // Apply sorting
    if (query.orderBy) {
      // Object-based orderBy
      Object.keys(query.orderBy).forEach(key => {
        queryBuilder.addOrderBy(`staff.${key}`, query.orderBy[key]);
      });
    } else if (query.orderByField) {
      // String-based orderByField with order
      queryBuilder.orderBy(`staff.${query.orderByField}`, query.order);
    } else {
      // Default sorting
      queryBuilder.orderBy('staff.createdAt', 'DESC');
    }

    // Apply pagination
    if (query.skip !== undefined) {
      queryBuilder.skip(query.skip);
    }

    if (query.take !== undefined) {
      queryBuilder.take(query.take);
    }

    // Always exclude password from select
    queryBuilder.addSelect('staff.password', 'password');

    const entities = await queryBuilder.getMany();
    return entities.map(entity => this.mapToModel(entity));
  }

  async findById(id: number, includePassword: boolean = false): Promise<StaffModel | null> {
    const queryBuilder = this.staffRepository
      .createQueryBuilder('staff')
      .where('staff.id = :id', { id }).leftJoinAndSelect('staff.role', 'role');

    if (includePassword) {
      queryBuilder.addSelect('staff.password');
    }

    const entity = await queryBuilder.getOne();

    if (!entity) {
      return null;
    }

    return this.mapToModel(entity);
  }

  async findByUsername(username: string, includePassword: boolean = false): Promise<StaffModel | null> {
    const queryBuilder = this.staffRepository.createQueryBuilder('staff')
      .where('staff.userName = :username', { username })
      .leftJoinAndSelect('staff.role', 'role'); // เพิ่มการ join role
  
    if (includePassword) {
      queryBuilder.addSelect('staff.password');
    }
  
    const entity = await queryBuilder.getOne();
    return entity ? this.mapToModel(entity) : null;
  }



  async create(data: CreateStaffDto): Promise<StaffModel> {
    const entity = this.staffRepository.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedEntity = await this.staffRepository.save(entity);
    return this.mapToModel(savedEntity);
  }

  async update(id: number, data: UpdateStaffDto): Promise<StaffModel> {
    const entity = await this.staffRepository.findOne({
      where: { StaffId: id }
    });

    if (!entity) {
      throw new NotFoundException(`Staff with id ${id} not found`);
    }

    Object.assign(entity, {
      ...data,
      updatedAt: new Date(),
    });

    const updated = await this.staffRepository.save(entity);
    return this.mapToModel(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.staffRepository.delete(id);
    return result.affected > 0;
  }

  private mapToModel(entity: StaffEntity): StaffModel {
    const staffModel = new StaffModel();
    return {
      ...staffModel,
      id: entity.StaffId,
      name: entity.StaffName,
      gender: entity.Gender,
      tel: entity.Tel,
      address: entity.Address,
      userName: entity.userName,
      password: entity.password,
      position: entity.Position, 
      salary: entity.Salary,
      roleId: entity.roleId,
      role: entity.role,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

}