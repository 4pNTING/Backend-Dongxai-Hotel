// src/modules/bookings.module.ts (อัปเดต)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from '../infrastructure/persistence/entities/booking.entity';
import { CheckInEntity } from '../infrastructure/persistence/entities/check-in.entity';
import { CheckOutEntity } from '../infrastructure/persistence/entities/check-out.entity';
import { CancellationEntity } from '../infrastructure/persistence/entities/cancellation.entity';
import { RoomEntity } from '../infrastructure/persistence/entities/room.entity';
import { RoomTypeEntity } from '../infrastructure/persistence/entities/room-type.entity';
import { RoomStatusEntity } from '../infrastructure/persistence/entities/room-status.entity';
import { CustomerEntity } from '../infrastructure/persistence/entities/customer.entity';
import { StaffEntity } from '../infrastructure/persistence/entities/staff.entity';

import { BookingRepository } from '../infrastructure/persistence/repositories/booking.repository';
import { CheckInRepository } from '../infrastructure/persistence/repositories/check-in.repository';
import { CheckOutRepository } from '../infrastructure/persistence/repositories/check-out.repository';
import { CancellationRepository } from '../infrastructure/persistence/repositories/cancellation.repository';
import { RoomRepository } from '../infrastructure/persistence/repositories/room.repository';

import { BookingService } from '../application/services/bookings.service';
import { CheckInService } from '../application/services/check-in.service';
import { CheckOutService } from '../application/services/check-out.service';
import { CancellationService } from '../application/services/cancellation.service';

import { BookingUseCase } from '../application/use-cases/booking.use-case';
import { BookingController } from '../presentation/controllers/booking.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingEntity,
      CheckInEntity,
      CheckOutEntity,
      CancellationEntity,
      RoomEntity,
      RoomTypeEntity,
      RoomStatusEntity,
      CustomerEntity,
      StaffEntity
    ])
  ],
  controllers: [BookingController],
  providers: [
    // Repositories
    BookingRepository,
    CheckInRepository,
    CheckOutRepository,
    CancellationRepository,
    RoomRepository,
    
    // Services
    BookingService,
    CheckInService,
    CheckOutService,
    CancellationService,
    
    // Use Cases
    {
      provide: 'BookingServicePort',
      useClass: BookingService
    },
    BookingUseCase
  ],
  exports: [
    BookingService,
    BookingRepository,
    CheckInRepository,
    CheckOutRepository,
    CancellationRepository,
    'BookingServicePort'
  ],
})
export class BookingsModule {}