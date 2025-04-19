import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/persistence/database.module';
import databaseConfig from './infrastructure/config/typeorm.config';

import { CustomersModule } from './modules/customers.module';
import { StaffModule } from './modules/staff.module';
import { RoomsModule } from './modules/rooms.module';
import { BookingsModule } from './modules/bookings.module';
import { CheckInModule } from './modules/check-in.module';
import { CheckOutModule } from './modules/check-out.module';
import { PaymentsModule } from './modules/payments.module';
import { CancellationsModule } from './modules/cancellations.module';
import { AuthModule } from './modules/auth.module';
import { RolesModule } from './modules/rold.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    DatabaseModule, 
    CustomersModule,
    StaffModule,
    RoomsModule,
    BookingsModule,
    CheckInModule,
    CheckOutModule,
    PaymentsModule,
    CancellationsModule,
    RolesModule,
    AuthModule,
  ],
})
export class AppModule {}