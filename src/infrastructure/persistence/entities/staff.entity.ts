import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BookingEntity } from './booking.entity';
import { CheckInEntity } from './check-in.entity';
import { CheckOutEntity } from './check-out.entity';
import { PaymentEntity } from './payment.entity';
import { CancellationEntity } from './cancellation.entity';
import { RoleEntity } from './role.entity';

@Entity('staffs')
export class StaffEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  StaffId: number;

  @Column({ length: 30 })
  StaffName: string;

  @Column({ nullable: false, default: 'UNKNOWN' }) // แก้ไขที่นี่
  Gender: string;

  @Column({ type: 'integer' })
  Tel: number;

  @Column({ length: 30 })
  Address: string;

  @Column({ length: 30 })
  userName: string;

  @Column({ nullable: true }) // If you want to allow null temporarily
  password: string;



  @Column({ type: 'float',nullable: true  })
  Salary: number;

  @Column({ nullable: true })
  roleId: number; 

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => BookingEntity, booking => booking.StaffId)
  bookings: BookingEntity[];

  @OneToMany(() => CheckInEntity, checkIn => checkIn.staff)
  checkIns: CheckInEntity[];

  @OneToMany(() => CheckOutEntity, checkOut => checkOut.staff)
  checkOuts: CheckOutEntity[];

  @OneToMany(() => PaymentEntity, payment => payment.staff)
  payments: PaymentEntity[];

  @OneToMany(() => CancellationEntity, cancellation => cancellation.staff)
  cancellations: CancellationEntity[];

  @ManyToOne(() => RoleEntity, role => role.staffs)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;
}