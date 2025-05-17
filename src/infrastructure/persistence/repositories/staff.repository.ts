// src/infrastructure/persistence/repositories/staff.repository.ts
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffEntity } from '../entities/staff.entity';
import { StaffModel } from '../../../core/domain/models/staff.model';
import { QueryDto } from '../../../application/common/query.dto';
import { CreateStaffDto, UpdateStaffDto } from '../../../application/dtos/staff.dto';

@Injectable()
export class StaffRepository {
  private readonly logger = new Logger(StaffRepository.name);

  constructor(
    @InjectRepository(StaffEntity)
    private readonly staffRepository: Repository<StaffEntity>,
  ) { }

  async findAll(query: QueryDto): Promise<StaffModel[]> {
    this.logger.log(`Finding all staff with query: ${JSON.stringify(query)}`);
    
    const queryBuilder = this.staffRepository.createQueryBuilder('staff');

    // Apply select with support for relations
    if (query.select && query.select.length > 0) {
      const selectFields = [];
      
      query.select.forEach(field => {
        // Handle relation fields (containing '.')
        if (field.includes('.')) {
          // We don't need to do anything here as they'll be handled by leftJoinAndSelect
        } else {
          // Regular fields
          selectFields.push(`staff.${field}`);
        }
      });
      
      if (selectFields.length > 0) {
        queryBuilder.select(selectFields);
      }
    }

    // Apply relations with support for nested relations
    if (query.relations && query.relations.length > 0) {
      query.relations.forEach(relation => {
        // For nested relations (contains '.')
        if (relation.includes('.')) {
          const relationParts = relation.split('.');
          const parentRelation = relationParts[0];
          const childRelation = relationParts.slice(1).join('.');
          
          queryBuilder.leftJoinAndSelect(`staff.${parentRelation}`, parentRelation);
          queryBuilder.leftJoinAndSelect(`${parentRelation}.${childRelation}`, relationParts.join('_'));
        } else {
          // For regular relations
          queryBuilder.leftJoinAndSelect(`staff.${relation}`, relation);
        }
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
        '(staff.StaffName ILIKE :search OR staff.userName ILIKE :search)',
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

    // Log the SQL query for debugging
    this.logger.debug(`Generated SQL: ${queryBuilder.getSql()}`);

    // Execute query based on getType
    if (query.getType === 'one') {
      const entity = await queryBuilder.getOne();
      return entity ? [this.mapToModel(entity)] : [];
    } else {
      const entities = await queryBuilder.getMany();
      return entities.map(entity => this.mapToModel(entity));
    }
  }

  async findById(id: number, includePassword: boolean = false): Promise<StaffModel | null> {
    const queryBuilder = this.staffRepository
      .createQueryBuilder('staff')
      .where('staff.StaffId = :id', { id })
      .leftJoinAndSelect('staff.role', 'role');

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
      .leftJoinAndSelect('staff.role', 'role');
  
    if (includePassword) {
      queryBuilder.addSelect('staff.password');
    }
  
    const entity = await queryBuilder.getOne();
    return entity ? this.mapToModel(entity) : null;
  }

  async create(data: CreateStaffDto): Promise<StaffModel> {
    // ใช้ข้อมูลจาก DTO โดยตรงเนื่องจากตอนนี้ DTO มีฟิลด์ที่ตรงกับ Entity แล้ว
    const entityData = {
      StaffName: data.StaffName,
      Gender: data.gender || 'UNKNOWN', // ใช้ gender จาก DTO หรือค่าเริ่มต้น
      Tel: data.tel,
      Address: data.address,
      userName: data.userName,
      password: data.password,
      Salary: data.salary || 0, // ใช้ salary จาก DTO หรือค่าเริ่มต้น
      roleId: data.roleId || 3 // ใช้ roleId จาก DTO หรือค่าเริ่มต้น
    };
  
    const entity = this.staffRepository.create(entityData);
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

  // แปลงข้อมูลจาก DTO เป็น Entity
  if (data.StaffName !== undefined) entity.StaffName = data.StaffName;
  if (data.gender !== undefined) entity.Gender = data.gender;
  if (data.tel !== undefined) entity.Tel = data.tel;
  if (data.address !== undefined) entity.Address = data.address;
  if (data.userName !== undefined) entity.userName = data.userName;
  if (data.salary !== undefined) entity.Salary = data.salary;
  if (data.roleId !== undefined) entity.roleId = data.roleId;
  if (data.password !== undefined) entity.password = data.password;
  
  // อัปเดตเวลา
  entity.updatedAt = new Date();

  // บันทึกการเปลี่ยนแปลง
  const updated = await this.staffRepository.save(entity);
  return this.mapToModel(updated);
}

  async delete(id: number): Promise<boolean> {
    const result = await this.staffRepository.delete({ StaffId: id });
    return result.affected > 0;
  }

  private mapToModel(entity: StaffEntity): StaffModel {
    const staffModel = new StaffModel();
    return {
      ...staffModel,
      StaffId: entity.StaffId,      // ใช้ StaffId (ตรงกับใน Model)
      StaffName: entity.StaffName,   // ใช้ StaffName (ตรงกับใน Model)
      gender: entity.Gender,
      tel: entity.Tel,
      address: entity.Address,
      userName: entity.userName,
      password: entity.password,
      salary: entity.Salary,
      roleId: entity.roleId,
      role: entity.role ? {
        id: entity.role.id,
        name: entity.role.name,
        createdAt: entity.role.createdAt,
        updatedAt: entity.role.updatedAt
      } : undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }
}