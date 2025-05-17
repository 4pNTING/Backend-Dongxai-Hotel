
// src/infrastructure/persistence/entities/booking-status.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BookingEntity } from './booking.entity';

@Entity('booking_statuses')
export class BookingStatusEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  StatusId: number;

  @Column({ type: 'character varying', length: 50 })
  StatusName: string;
  
  @Column({ type: 'character varying', length: 255, nullable: true }) // เพิ่ม nullable: true เพื่อให้สามารถเป็น null ได้
  Description: string;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => BookingEntity, booking => booking.BookingStatus)
  bookings: BookingEntity[];
}