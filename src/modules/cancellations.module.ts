// src/modules/cancellations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancellationEntity } from '../infrastructure/persistence/entities/cancellation.entity';
import { CancellationRepository } from '../infrastructure/persistence/repositories/cancellation.repository';
import { CancellationService } from '../application/services/cancellation.service';
import { CancellationUseCase } from '../application/use-cases/Cancellation-use.case';
import { CancellationController } from '../presentation/controllers/cancellations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CancellationEntity])],
  controllers: [CancellationController],
  providers: [
    CancellationRepository,
    CancellationService,
    {
      provide: 'CancellationServicePort',
      useClass: CancellationService
    },
    CancellationUseCase
  ],
  exports: [CancellationService],
})
export class CancellationModule {}