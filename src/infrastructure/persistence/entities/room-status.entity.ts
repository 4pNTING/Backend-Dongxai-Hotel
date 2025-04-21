// src/infrastructure/persistence/entities/room-status.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('RoomStatus')
export class RoomStatusEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  StatusId: number;

  @Column({ length: 255 })
  StatusName: string;
}