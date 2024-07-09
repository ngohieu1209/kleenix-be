import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AddressEntity } from './address.entity';
import { BOOKING_STATUS } from '../../shared/enums/booking.enum';
import { PackageEntity } from './package.entity';
import { BookingExtraServiceEntity } from './booking-extra-service.entity';
import { HouseWorkerEntity } from './house-worker.entity';
import { BookingEntity } from './booking.entity';

@Entity({
  name: 'assignment',
})
export class AssignmentEntity extends BaseEntity {
  @Column({ name: 'assigned_time' })
  assignedTime: Date;
  
  @Column({ name: 'start_time' })
  startTime: Date;
  
  @Column({ name: 'end_time' })
  endTime: Date;
  
  @Column({
    nullable: true
  })
  evidence: string;
  
  // RELATION
  // -----------------------------------------------------------------------------

  @ManyToOne(() => HouseWorkerEntity, (houseWorker) => houseWorker.assignment, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
  })
  @JoinColumn({ 
    name: 'house_worker_id',
    foreignKeyConstraintName: 'FK_HOUSE_WORKER_TABLE_ASSIGNMENT'
  })
  houseWorker: HouseWorkerEntity;
  
  @ManyToOne(() => BookingEntity, (booking) => booking.assignment, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
  })
  @JoinColumn({ 
    name: 'booking_id',
    foreignKeyConstraintName: 'FK_BOOKING_TABLE_ASSIGNMENT'
  })
  booking: BookingEntity;
}
