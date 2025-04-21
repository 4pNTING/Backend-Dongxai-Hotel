// src/modules/room-type.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomTypeEntity } from '../infrastructure/persistence/entities/room-type.entity';
import { RoomTypeRepository } from '../infrastructure/persistence/repositories/room-type.repository';
import { RoomTypeService } from '../application/services/room-type.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomTypeEntity
    ])
  ],
  providers: [
    RoomTypeRepository,
    RoomTypeService
  ],
  exports: [RoomTypeService, RoomTypeRepository],
})
export class RoomTypeModule {}