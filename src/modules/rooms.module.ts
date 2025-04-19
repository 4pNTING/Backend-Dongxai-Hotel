// src/modules/rooms.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '../infrastructure/persistence/entities/room.entity';
import { RoomRepository } from '../infrastructure/persistence/repositories/room.repository';
import { RoomService } from '../application/services/rooms.service';
import { RoomUseCase } from '../application/use-cases/room.use-case';
import { RoomController } from '../presentation/controllers/rooms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity])],
  controllers: [RoomController],
  providers: [
    RoomRepository,
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