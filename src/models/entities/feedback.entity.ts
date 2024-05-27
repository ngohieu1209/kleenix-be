import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BookingEntity } from './booking.entity';
import { CustomerEntity } from './customer.entity';

@Entity({
  name: 'feedback',
})
export class FeedbackEntity extends BaseEntity {
  @Column()
  rating: number;
  
  @Column()
  feedback: string;
  
  // RELATION
  // -----------------------------------------------------------------------------

  @ManyToOne(() => CustomerEntity, (customer) => customer.feedback, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
  })
  @JoinColumn({ 
    name: 'customer_id',
    foreignKeyConstraintName: 'FK_CUSTOMER_TABLE_FEEDBACK'
  })
  customer: CustomerEntity;
  
  @ManyToOne(() => BookingEntity, (booking) => booking.feedback, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
  })
  @JoinColumn({ 
    name: 'booking_id',
    foreignKeyConstraintName: 'FK_BOOKING_TABLE_FEEDBACK'
  })
  booking: BookingEntity;
}
