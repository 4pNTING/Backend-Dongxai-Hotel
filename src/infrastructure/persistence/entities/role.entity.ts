
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StaffEntity } from './staff.entity';


@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ nullable: true })
  name: string;
  
  @Column({ nullable: true })
  description: string;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
  
  @OneToMany(() => StaffEntity, staff => staff.role)
  staffs: StaffEntity[];
}




