import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerEntity } from '../persistence/entities/customer.entity';
import { BookingEntity } from '../persistence/entities/booking.entity';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'hotel_management'),
        entities: [
     
          CustomerEntity, 
          BookingEntity,
       
        ],
        synchronize: configService.get<boolean>('DB_SYNC', false),
        logging: configService.get<boolean>('DB_LOGGING', false),
        autoLoadEntities: true,
        migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
      }),
    }),
  ],
})
export class DatabaseModule {}