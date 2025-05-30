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
  CheckinId: number; // ตรงกับฐานข้อมูล

  @Column({ name: 'CheckinDate', type: 'date' })
  CheckinDate: Date; // ตรงกับฐานข้อมูล

  @Column({ type: 'date' })
  CheckoutDate: Date;

  @Column()
  RoomId: number;

  @Column()
  BookingId: number;

  @Column({ name: 'GuestId' })
  GuestId: number; // ตรงกับฐานข้อมูล (ใช้ GuestId ไม่ใช่ CustomerId)

  @Column()
  StaffId: number;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'GuestId' })
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