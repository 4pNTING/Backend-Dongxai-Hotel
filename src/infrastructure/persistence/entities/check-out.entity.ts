// src/infrastructure/persistence/entities/check-out.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CheckInEntity } from './check-in.entity';
import { RoomEntity } from './room.entity';
import { StaffEntity } from './staff.entity';
import { PaymentEntity } from './payment.entity';

@Entity('checkouts')
export class CheckOutEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  CheckoutId: number;

  @Column({ type: 'date' })
  CheckoutDate: Date;

  @Column({ type: 'integer' })
  CheckinId: number;

  @Column({ type: 'integer' })
  RoomId: number;

  @Column({ type: 'integer' })
  StaffId: number;

  @ManyToOne(() => CheckInEntity, checkIn => checkIn.checkOuts)
  @JoinColumn({ name: 'CheckinId' })
  checkIn: CheckInEntity;

  @ManyToOne(() => RoomEntity, room => room.checkOuts)
  @JoinColumn({ name: 'RoomId' })
  room: RoomEntity;

  @ManyToOne(() => StaffEntity, staff => staff.checkOuts)
  @JoinColumn({ name: 'StaffId' })
  staff: StaffEntity;

  @OneToMany(() => PaymentEntity, payment => payment.checkOut)
  payments: PaymentEntity[];
}