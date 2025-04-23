// src/infrastructure/persistence/entities/room-status.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RoomEntity } from './room.entity';

@Entity('room_statuses')
export class RoomStatusEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  StatusId: number;

  @Column({ type: 'varchar', length: 50 })
  StatusName: string;

  @OneToMany(() => RoomEntity, room => room.roomStatus)
  rooms: RoomEntity[];
}