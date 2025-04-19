// src/modules/bookings.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from '../infrastructure/persistence/entities/booking.entity';
import { BookingRepository } from '../infrastructure/persistence/repositories/booking.repository';
import { BookingService } from '../application/services/bookings.service';
import { BookingUseCase } from '../application/use-cases/booking.use-case';
import { BookingController } from '../presentation/controllers/booking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity])],
  controllers: [BookingController],
  providers: [
    BookingRepository,
    BookingService,
    {
      provide: 'BookingServicePort',
      useClass: BookingService
    },
    BookingUseCase
  ],
  exports: [BookingService],
})
export class BookingsModule {}