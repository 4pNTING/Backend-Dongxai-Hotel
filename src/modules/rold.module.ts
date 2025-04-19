import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../infrastructure/persistence/entities/role.entity';
import { RoleRepository } from '../infrastructure/persistence/repositories/role.repository';
import { RoleController } from '../presentation/controllers/rold.controller';
import { RoleService } from '../application/services/rold.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity]),
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService, RoleRepository],
})
export class RolesModule {}