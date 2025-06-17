// src/app.module.ts (อัปเดต)
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/persistence/database.module';
import databaseConfig from './infrastructure/config/typeorm.config';

// เพิ่ม CoreServicesModule
import { CoreServicesModule } from './modules/core-services.module';

import { CustomersModule } from './modules/customers.module';
import { StaffModule } from './modules/staff.module';
import { RoomsModule } from './modules/rooms.module';
import { RoomTypeModule } from './modules/room-type.module';
import { RoomStatusModule } from './modules/room-status.module';
import { BookingsModule } from './modules/bookings.module';
import { CheckInModule } from './modules/check-in.module';
import { CheckOutModule } from './modules/check-out.module';
import { PaymentsModule } from './modules/payments.module';
import { CancellationModule } from './modules/cancellations.module';
import { AuthModule } from './modules/auth.module';
import { RolesModule } from './modules/rold.module';
import { BookingStatusModule } from './modules/booking-status.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    DatabaseModule,
    

    CoreServicesModule,
    
    BookingStatusModule,
    RoomTypeModule,    
    RoomStatusModule,  
    CustomersModule,
    StaffModule,
    RoomsModule,
    BookingsModule,
    CheckInModule,
    CheckOutModule,
    PaymentsModule,
    CancellationModule,
    RolesModule,
    AuthModule,
  ],
})
export class AppModule {}