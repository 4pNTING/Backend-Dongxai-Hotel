// src/modules/room-status.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomStatusEntity } from '../infrastructure/persistence/entities/room-status.entity';
import { RoomStatusRepository } from '../infrastructure/persistence/repositories/room-status.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomStatusEntity
    ])
  ],
  providers: [
    RoomStatusRepository
  ],
  exports: [RoomStatusRepository],
})
export class RoomStatusModule {}