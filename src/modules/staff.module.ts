// src/modules/staff.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffEntity } from '../infrastructure/persistence/entities/staff.entity';
import { StaffRepository } from '../infrastructure/persistence/repositories/staff.repository';
import { StaffService } from '../application/services/staff.service';
import { StaffUseCase } from '../application/use-cases/Staff-use-case';
import { StaffController } from '../presentation/controllers/staff.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffEntity])
  ],
  controllers: [StaffController],
  providers: [
    StaffRepository,
    StaffService,
    {
      provide: 'StaffServicePort',
      useClass: StaffService
    },
    StaffUseCase
  ],
  exports: [
    StaffService, 
    StaffUseCase,
    StaffRepository
  ],
})
export class StaffModule {}