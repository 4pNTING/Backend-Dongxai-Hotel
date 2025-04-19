// src/infrastructure/persistence/entities/room-type.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roomtypes')
export class RoomTypeEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  TypeId: number;

  @Column({ length: 255 })
  TypeName: string;
}