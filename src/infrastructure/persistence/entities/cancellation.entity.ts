// src/infrastructure/persistence/entities/cancellation.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BookingEntity } from './booking.entity';
import { StaffEntity } from './staff.entity';

@Entity('cancellations')
export class CancellationEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  CancelId: number;

  @Column({ type: 'date' })
  CancelDate: Date;

  @Column({ type: 'integer' })
  StaffId: number;

  @Column({ type: 'integer' })
  BookingId: number;

  @ManyToOne(() => BookingEntity, booking => booking.cancellations)
  @JoinColumn({ name: 'BookingId' })
  booking: BookingEntity;

  @ManyToOne(() => StaffEntity, staff => staff.cancellations)
  @JoinColumn({ name: 'StaffId' })
  staff: StaffEntity;
}