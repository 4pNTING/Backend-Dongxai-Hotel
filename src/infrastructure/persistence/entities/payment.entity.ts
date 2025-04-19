// src/infrastructure/persistence/entities/payment.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CheckOutEntity } from './check-out.entity';
import { StaffEntity } from './staff.entity';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  PaymentId: number;

  @Column({ type: 'float' })
  PaymentPrice: number;

  @Column({ type: 'date' })
  PaymentDate: Date;

  @Column({ type: 'integer' })
  StaffId: number;

  @Column({ type: 'integer' })
  CheckoutId: number;

  @ManyToOne(() => CheckOutEntity, checkOut => checkOut.payments)
  @JoinColumn({ name: 'CheckoutId' })
  checkOut: CheckOutEntity;

  @ManyToOne(() => StaffEntity, staff => staff.payments)
  @JoinColumn({ name: 'StaffId' })
  staff: StaffEntity;
}