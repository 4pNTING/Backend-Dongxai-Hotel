import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RoleService } from '../../application/services/rold.service';
import { RoleEntity } from '../../infrastructure/persistence/entities/role.entity';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roldGuard';
import { Roles } from '../../core/decorators/roles.decorator';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<RoleEntity[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: number): Promise<RoleEntity> {
    return this.roleService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() roleData: Partial<RoleEntity>): Promise<RoleEntity> {
    return this.roleService.create(roleData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() roleData: Partial<RoleEntity>,
  ): Promise<RoleEntity> {
    return this.roleService.update(id, roleData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: number): Promise<boolean> {
    return this.roleService.delete(id);
  }
}