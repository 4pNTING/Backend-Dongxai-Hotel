// src/modules/rooms.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '../infrastructure/persistence/entities/room.entity';
import { RoomTypeEntity } from '../infrastructure/persistence/entities/room-type.entity';
import { RoomStatusEntity } from '../infrastructure/persistence/entities/room-status.entity';
import { RoomRepository } from '../infrastructure/persistence/repositories/room.repository';
import { RoomService } from '../application/services/rooms.service';
import { RoomUseCase } from '../application/use-cases/room.use-case';
import { RoomController } from '../presentation/controllers/rooms.controller';
import { RoomTypeRepository } from '../infrastructure/persistence/repositories/room-type.repository';
import { RoomStatusRepository } from '../infrastructure/persistence/repositories/room-status.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomEntity,
      RoomTypeEntity,
      RoomStatusEntity
    ])
  ],
  controllers: [RoomController],
  providers: [
    RoomRepository,
    RoomTypeRepository,
    RoomStatusRepository,
    RoomService,
    {
      provide: 'RoomServicePort',
      useClass: RoomService
    },
    RoomUseCase
  ],
  exports: [RoomService],
})
export class RoomsModule {}