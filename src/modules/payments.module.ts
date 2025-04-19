// src/modules/payments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from '../infrastructure/persistence/entities/payment.entity';
import { PaymentRepository } from '../infrastructure/persistence/repositories/payment.repository';
import { PaymentService } from '../application/services/payments.service';
import { PaymentUseCase } from '../application/use-cases/payment.use-case';
import { PaymentController } from '../presentation/controllers/payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  controllers: [PaymentController],
  providers: [
    PaymentRepository,
    PaymentService,
    {
      provide: 'PaymentServicePort',
      useClass: PaymentService
    },
    PaymentUseCase
  ],
  exports: [PaymentService],
})
export class PaymentsModule {}