import { NOTIFICATION_TYPE } from '../../shared/enums/notification.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { AdminManagerEntity } from './admin-manager.entity';
import { BaseEntity } from './base.entity';
import { BookingEntity } from './booking.entity';
import { CustomerEntity } from './customer.entity';
import { HouseWorkerEntity } from './house-worker.entity';

@Entity({
  name: 'notification',
})
export class NotificationEntity extends BaseEntity {
  @Column({
    type: 'text'
  })
  body: string;
  
  @Column({
    transformer: {
      to(value: string) {
        return value.toUpperCase();
      },
      from(value: string) {
        // Do nothing
        return value;
      }
    },
    nullable: false,
    type: 'enum',
    enum: NOTIFICATION_TYPE,
    enumName: 'NOTIFICATION_TYPE_ENUM',
    name: 'notification_type'
  })
  type: NOTIFICATION_TYPE;
  
  @Column({
    default: false
  })
  isMark: boolean;
  
  // RELATION
  // -----------------------------------------------------------------------------

  @ManyToOne(() => CustomerEntity, (customer) => customer.notification, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
    nullable: true,
  })
  @JoinColumn({ 
    name: 'customer_id',
    foreignKeyConstraintName: 'FK_CUSTOMER_TABLE_NOTIFICATION'
  })
  customer: CustomerEntity;
  
  @ManyToOne(() => HouseWorkerEntity, (houseWorker) => houseWorker.notification, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
    nullable: true,
  })
  @JoinColumn({ 
    name: 'house_worker_id',
    foreignKeyConstraintName: 'FK_HOUSE_WORKER_TABLE_NOTIFICATION'
  })
  houseWorker: HouseWorkerEntity;
  
  @ManyToOne(() => BookingEntity, (booking) => booking.notification, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
    nullable: true,
  })
  @JoinColumn({ 
    name: 'booking_id',
    foreignKeyConstraintName: 'FK_BOOKING_TABLE_NOTIFICATION',
  })
  booking: BookingEntity;
}
