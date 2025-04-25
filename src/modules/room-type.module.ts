// src/modules/room-type.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomTypeEntity } from '../infrastructure/persistence/entities/room-type.entity';
import { RoomTypeRepository } from '../infrastructure/persistence/repositories/room-type.repository';
import { RoomTypeService } from '../application/services/room-type.service';
import { RoomTypeUseCase } from '../application/use-cases/room-type.use-case';
import { RoomTypeController } from '../presentation/controllers/room-type.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomTypeEntity
    ])
  ],
  controllers: [
    RoomTypeController
  ],
  providers: [
    RoomTypeRepository,
    {
      provide: 'RoomTypeServicePort',
      useClass: RoomTypeService
    },
    RoomTypeUseCase
  ],
  exports: [RoomTypeRepository, 'RoomTypeServicePort', RoomTypeUseCase],
})
export class RoomTypeModule {}