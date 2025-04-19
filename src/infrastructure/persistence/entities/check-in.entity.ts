// src/infrastructure/persistence/entities/check-in.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BookingEntity } from './booking.entity';
import { RoomEntity } from './room.entity';
import { CustomerEntity } from './customer.entity';
import { StaffEntity } from './staff.entity';
import { CheckOutEntity } from './check-out.entity';

@Entity('checkins')
export class CheckInEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  CheckinId: number;

  @Column({ type: 'date' })
  CheckinDate: Date;

  @Column({ type: 'date' })
  CheckoutDate: Date;

  @Column({ type: 'integer' })
  RoomId: number;

  @Column({ type: 'integer', nullable: true })
  BookingId: number;

  @Column({ type: 'integer' })
  GuestId: number;

  @Column({ type: 'integer' })
  StaffId: number;

  @ManyToOne(() => BookingEntity, booking => booking.checkIns)
  @JoinColumn({ name: 'BookingId' })
  booking: BookingEntity;

  @ManyToOne(() => RoomEntity, room => room.checkIns)
  @JoinColumn({ name: 'RoomId' })
  room: RoomEntity;

  @ManyToOne(() => CustomerEntity, customer => customer.checkIns)
  @JoinColumn({ name: 'GuestId' })
  customer: CustomerEntity;

  @ManyToOne(() => StaffEntity, staff => staff.checkIns)
  @JoinColumn({ name: 'StaffId' })
  staff: StaffEntity;

  @OneToMany(() => CheckOutEntity, checkOut => checkOut.checkIn)
  checkOuts: CheckOutEntity[];
}

