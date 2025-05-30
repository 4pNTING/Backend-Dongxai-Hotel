import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from '../infrastructure/persistence/entities/booking.entity';
import { CheckInEntity } from '../infrastructure/persistence/entities/check-in.entity'; 
import { RoomEntity } from '../infrastructure/persistence/entities/room.entity';
import { RoomTypeEntity } from '../infrastructure/persistence/entities/room-type.entity';
import { RoomStatusEntity } from '../infrastructure/persistence/entities/room-status.entity';
import { CustomerEntity } from '../infrastructure/persistence/entities/customer.entity'; 
import { StaffEntity } from '../infrastructure/persistence/entities/staff.entity'; 
import { BookingRepository } from '../infrastructure/persistence/repositories/booking.repository';
import { CheckInRepository } from '../infrastructure/persistence/repositories/check-in.repository';
import { RoomRepository } from '../infrastructure/persistence/repositories/room.repository';
import { BookingService } from '../application/services/bookings.service';
import { BookingUseCase } from '../application/use-cases/booking.use-case';
import { BookingController } from '../../src/presentation/controllers/booking.controller'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingEntity,
      CheckInEntity,        
      RoomEntity,
      RoomTypeEntity,
      RoomStatusEntity,
      CustomerEntity,       
      StaffEntity          
    ])
  ],
  controllers: [BookingController],
  providers: [
    BookingRepository,
    CheckInRepository,    
    RoomRepository,
    BookingService,
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
    'BookingServicePort'
  ],
})
export class BookingsModule {}