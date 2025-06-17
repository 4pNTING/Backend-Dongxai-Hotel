// src/infrastructure/persistence/entities/check-in.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { RoomEntity } from './room.entity';
import { BookingEntity } from './booking.entity';
import { StaffEntity } from './staff.entity';
import { CheckOutEntity } from './check-out.entity';

@Entity('check_ins')
export class CheckInEntity {
  @PrimaryGeneratedColumn({ name: 'CheckinId' })
  CheckInId: number;

  @Column({ name: 'CheckinDate', type: 'date' })
  CheckInDate: Date;

  @Column({ name: 'CheckoutDate', type: 'date' })
  CheckoutDate: Date;

  // ===== Foreign Key Columns =====
  @Column({ name: 'RoomId' })
  RoomId: number;

  @Column({ name: 'BookingId' })
  BookingId: number;

  @Column({ name: 'CustomerId' }) 
  CustomerId: number;

  @Column({ name: 'StaffId' })
  StaffId: number;

  // ===== Relations (เหมือน Booking Entity) =====
  @ManyToOne(() => CustomerEntity, customer => customer.checkIns)
  @JoinColumn({ name: 'CustomerId' }) 
  customer: CustomerEntity;

  @ManyToOne(() => RoomEntity, room => room.checkIns)
  @JoinColumn({ name: 'RoomId' })
  room: RoomEntity;

  @ManyToOne(() => BookingEntity, booking => booking.checkIns)
  @JoinColumn({ name: 'BookingId' })
  booking: BookingEntity;

  @ManyToOne(() => StaffEntity, staff => staff.checkIns)
  @JoinColumn({ name: 'StaffId' })
  staff: StaffEntity;

  // ===== One-to-Many Relations =====
  @OneToMany(() => CheckOutEntity, checkOut => checkOut.checkIn)
  checkOuts: CheckOutEntity[];

  // ===== Timestamps (เหมือน Booking Entity) =====
  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: Date;
}