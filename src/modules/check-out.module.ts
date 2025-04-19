// src/modules/check-out.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckOutEntity } from '../infrastructure/persistence/entities/check-out.entity';
import { CheckOutRepository } from '../infrastructure/persistence/repositories/check-out.repository';
import { CheckOutService } from '../application/services/check-out.service';
import { CheckOutUseCase } from '../application/use-cases/checkout.use-case';
import { CheckOutController } from '../presentation/controllers/check-out.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CheckOutEntity])],
  controllers: [CheckOutController],
  providers: [
    CheckOutRepository,
    CheckOutService,
    {
      provide: 'CheckOutServicePort',
      useClass: CheckOutService
    },
    CheckOutUseCase
  ],
  exports: [CheckOutService],
})
export class CheckOutModule {}