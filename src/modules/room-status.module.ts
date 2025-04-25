// src/modules/room-status.module.ts 
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomStatusEntity } from '../infrastructure/persistence/entities/room-status.entity';
import { RoomStatusRepository } from '../infrastructure/persistence/repositories/room-status.repository';
import { RoomStatusService } from '../application/services/room-status.service';
import { RoomStatusUseCase } from '../application/use-cases/room-status.use-case';
import { RoomStatusController } from '../presentation/controllers/room-status.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomStatusEntity
    ])
  ],
  controllers: [
    RoomStatusController
  ],
  providers: [
    RoomStatusRepository,
    {
      provide: 'RoomStatusServicePort',
      useClass: RoomStatusService
    },
    RoomStatusUseCase
  ],
  exports: [RoomStatusRepository, 'RoomStatusServicePort', RoomStatusUseCase],
})
export class RoomStatusModule {}