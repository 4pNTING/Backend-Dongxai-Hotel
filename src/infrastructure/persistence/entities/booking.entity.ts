// src/infrastructure/persistence/entities/booking.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { RoomEntity } from './room.entity';
import { CustomerEntity } from './customer.entity';
import { StaffEntity } from './staff.entity';
import { CheckInEntity } from './check-in.entity';
import { CancellationEntity } from './cancellation.entity';
// src/core/enum/BookingStatus.ts
import { BookingStatusEnum } from '../../../core/enum/BookingStatus';
@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  BookingId: number;

  @Column({ type: 'date' })
  BookingDate: Date;

  @Column({ type: 'integer' })
  RoomId: number;

  @ManyToOne(() => RoomEntity, room => room.bookings)
  @JoinColumn({ name: 'RoomId' })
  room: RoomEntity;

  @Column({ type: 'date' })
  CheckinDate: Date;

  @Column({ type: 'date' })
  CheckoutDate: Date;

  @Column({ type: 'integer' })
  CustomerId: number;

  @ManyToOne(() => CustomerEntity, customer => customer.bookings)
  @JoinColumn({ name: 'GuestId' })
  customer: CustomerEntity;

  @Column({ type: 'integer' })
  StaffId: number;

  @ManyToOne(() => StaffEntity, staff => staff.bookings)
  @JoinColumn({ name: 'StaffId' })
  staff: StaffEntity;

  @Column({ type: 'varchar', length: 50 })
  BookingStatus: BookingStatusEnum;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: Date;

  @OneToMany(() => CheckInEntity, checkIn => checkIn.booking)
  checkIns: CheckInEntity[];

  @OneToMany(() => CancellationEntity, cancellation => cancellation.booking)
  cancellations: CancellationEntity[];
  
}