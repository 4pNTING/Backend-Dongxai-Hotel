import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from '../../infrastructure/persistence/repositories/role.repository';
import { RoleEntity } from '../../infrastructure/persistence/entities/role.entity';
import { QueryDto } from '../../application/common/query.dto'; // เพิ่มการอิมพอร์ต

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.findAll();
  }

  async findById(id: number): Promise<RoleEntity> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async findByName(name: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findByName(name);
    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }
    return role;
  }

  async create(roleData: Partial<RoleEntity>): Promise<RoleEntity> {
    return this.roleRepository.create(roleData);
  }

  async update(id: number, roleData: Partial<RoleEntity>): Promise<RoleEntity> {
    await this.findById(id); // Verify role exists
    return this.roleRepository.update(id, roleData);
  }

  async delete(id: number): Promise<boolean> {
    await this.findById(id); // Verify role exists
    return this.roleRepository.delete(id);
  }

  async query(queryDto: QueryDto): Promise<RoleEntity | RoleEntity[]> {
    return this.roleRepository.query(queryDto);
  }
}