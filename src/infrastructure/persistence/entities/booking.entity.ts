// src/infrastructure/persistence/entities/booking.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { RoomEntity } from './room.entity';
import { CustomerEntity } from './customer.entity';
import { StaffEntity } from './staff.entity';
import { CheckInEntity } from './check-in.entity';
import { CancellationEntity } from './cancellation.entity';

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  BookingId: number;

  @Column({ type: 'date' })
  BookingDate: Date;

  @Column({ type: 'integer' })
  RoomId: number;

  @Column({ type: 'date' })
  CheckinDate: Date;

  @Column({ type: 'date' })
  CheckoutDate: Date;

  @Column({ type: 'integer' })
  GuestId: number;

  @Column({ type: 'integer' })
  StaffId: number;

  @ManyToOne(() => RoomEntity, room => room.bookings)
  @JoinColumn({ name: 'RoomId' })
  room: RoomEntity;

  @ManyToOne(() => CustomerEntity, customer => customer.bookings)
  @JoinColumn({ name: 'GuestId' })
  customer: CustomerEntity;

  @ManyToOne(() => StaffEntity, staff => staff.bookings)
  @JoinColumn({ name: 'StaffId' })
  staff: StaffEntity;

  @OneToMany(() => CheckInEntity, checkIn => checkIn.booking)
  checkIns: CheckInEntity[];

  @OneToMany(() => CancellationEntity, cancellation => cancellation.booking)
  cancellations: CancellationEntity[];
}