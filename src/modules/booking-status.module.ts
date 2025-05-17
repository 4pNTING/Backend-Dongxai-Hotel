
// src/modules/booking-status.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingStatusEntity } from '../infrastructure/persistence/entities/booking-status.entity';
import { BookingStatusRepository } from '../infrastructure/persistence/repositories/booking-status.repository';
import { BookingStatusService } from '../application/services/booking-status.service';
import { BookingStatusUseCase } from '../application/use-cases/booking-status.use-case';
import { BookingStatusController } from '../presentation/controllers/booking-status.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingStatusEntity
    ])
  ],
  controllers: [
    BookingStatusController
  ],
  providers: [
    BookingStatusRepository,
    {
      provide: 'BookingStatusServicePort',
      useClass: BookingStatusService
    },
    BookingStatusUseCase
  ],
  exports: [BookingStatusRepository, 'BookingStatusServicePort', BookingStatusUseCase],
})
export class BookingStatusModule {}