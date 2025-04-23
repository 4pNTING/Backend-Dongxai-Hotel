// src/infrastructure/persistence/entities/check-in.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { RoomEntity } from './room.entity';
import { BookingEntity } from './booking.entity';
import { StaffEntity } from './staff.entity';
import { CheckOutEntity } from './check-out.entity';

@Entity('check_ins')
export class CheckInEntity {
  @PrimaryGeneratedColumn({ name: 'CheckinId' }) // ใช้ชื่อคอลัมน์ที่มีอยู่เดิมในฐานข้อมูล
  CheckInId: number;

  @Column({ name: 'CheckinDate', type: 'date' }) // ใช้ชื่อคอลัมน์ที่มีอยู่เดิมในฐานข้อมูล
  CheckInDate: Date;

  @Column({ type: 'date' })
  CheckoutDate: Date;

  @Column()
  RoomId: number;

  @Column()
  BookingId: number;

  @Column({ name: 'GuestId' }) // ใช้ชื่อคอลัมน์ที่มีอยู่เดิมในฐานข้อมูล
  CustomerId: number;

  @Column()
  StaffId: number;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'GuestId' }) // ใช้ชื่อคอลัมน์ที่มีอยู่เดิมในฐานข้อมูล
  customer: CustomerEntity;

  @ManyToOne(() => RoomEntity)
  @JoinColumn({ name: 'RoomId' })
  room: RoomEntity;

  @ManyToOne(() => BookingEntity)
  @JoinColumn({ name: 'BookingId' })
  booking: BookingEntity;

  @ManyToOne(() => StaffEntity)
  @JoinColumn({ name: 'StaffId' })
  staff: StaffEntity;

  @OneToMany(() => CheckOutEntity, checkOut => checkOut.checkIn)
  checkOuts: CheckOutEntity[];
}