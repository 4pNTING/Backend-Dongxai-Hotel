// src/infrastructure/persistence/entities/room.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BookingEntity } from './booking.entity';
import { CheckInEntity } from './check-in.entity';
import { CheckOutEntity } from './check-out.entity';
import { RoomTypeEntity } from './room-type.entity';
import { RoomStatusEntity } from './room-status.entity';

@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  RoomId: number;

  @Column({ length: 3 })
  RoomType: string;

  @Column({ length: 10 })
  RoomStatus: string;

  @Column({ type: 'float' })
  RoomPrice: number;

  @OneToMany(() => BookingEntity, booking => booking.room)
  bookings: BookingEntity[];

  @OneToMany(() => CheckInEntity, checkIn => checkIn.room)
  checkIns: CheckInEntity[];

  @OneToMany(() => CheckOutEntity, checkOut => checkOut.room)
  checkOuts: CheckOutEntity[];
}