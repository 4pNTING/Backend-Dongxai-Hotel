// src/modules/check-in.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInEntity } from '../infrastructure/persistence/entities/check-in.entity';
import { CheckInRepository } from '../infrastructure/persistence/repositories/check-in.repository';
import { CheckInService } from '../application/services/check-in.service';
import { CheckInUseCase } from '../application/use-cases/checkIn.use-case';
import { CheckInController } from '../presentation/controllers/check-in.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CheckInEntity])],
  controllers: [CheckInController],
  providers: [
    CheckInRepository,
    CheckInService,
    {
      provide: 'CheckInServicePort',
      useClass: CheckInService
    },
    CheckInUseCase
  ],
  exports: [CheckInService],
})
export class CheckInModule {}