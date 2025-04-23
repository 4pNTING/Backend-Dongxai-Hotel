// src/infrastructure/persistence/entities/room-type.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RoomEntity } from './room.entity';

@Entity('room_types')
export class RoomTypeEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  TypeId: number;

  @Column({ type: 'varchar', length: 50 })
  TypeName: string;

  @OneToMany(() => RoomEntity, room => room.roomType)
  rooms: RoomEntity[];
}