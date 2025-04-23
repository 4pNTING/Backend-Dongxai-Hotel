// src/infrastructure/persistence/entities/customer.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BookingEntity } from './booking.entity';
import { CheckInEntity } from './check-in.entity';

@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  CustomerId: number;

  @Column({ length: 30 })
  CustomerName: string;

  @Column({ length: 15 })
  CustomerGender: string;

  @Column({ type: 'integer' })
  CustomerTel: number;

  @Column({ nullable: true })
  CustomerAddress: string;

  @Column({ nullable: true })
  CustomerPostcode: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => BookingEntity, booking => booking.customer)
  bookings: BookingEntity[];

  @OneToMany(() => CheckInEntity, checkIn => checkIn.customer)
  checkIns: CheckInEntity[];

  // Removed duplicate declaration of checkIns
}

