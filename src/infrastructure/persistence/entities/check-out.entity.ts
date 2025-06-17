// src/infrastructure/persistence/entities/check-out.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CheckInEntity } from './check-in.entity';
import { RoomEntity } from './room.entity';
import { StaffEntity } from './staff.entity';
import { PaymentEntity } from './payment.entity';

@Entity('check_outs')
export class CheckOutEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  CheckoutId: number;

  @Column({ type: 'date' })
  CheckoutDate: Date;

  @Column({ type: 'integer', name: 'CheckInId' })
  CheckInId: number; // เปลี่ยนจาก CheckinId เป็น CheckInId

  @ManyToOne(() => CheckInEntity, checkIn => checkIn.checkOuts)
  @JoinColumn({ name: 'CheckInId' })
  checkIn: CheckInEntity; // Join ด้วย CheckInId

  @Column({ type: 'integer' })
  RoomId: number;

  @ManyToOne(() => RoomEntity, room => room.checkOuts)
  @JoinColumn({ name: 'RoomId' })
  room: RoomEntity;

  @Column({ type: 'integer' })
  StaffId: number;

  @ManyToOne(() => StaffEntity, staff => staff.checkOuts)
  @JoinColumn({ name: 'StaffId' })
  staff: StaffEntity;

  @OneToMany(() => PaymentEntity, payment => payment.checkOut)
  payments: PaymentEntity[];
}