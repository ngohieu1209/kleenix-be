import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BookingEntity } from './booking.entity';
import { ExtraServiceEntity } from './extra-service.entity';

@Entity({
  name: 'booking_extra_service',
})
export class BookingExtraServiceEntity extends BaseEntity {
  // RELATION
  // -----------------------------------------------------------------------------
  
  @ManyToOne(() => BookingEntity, (booking) => booking.bookingExtraService, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ 
    name: 'booking_id',
    foreignKeyConstraintName: 'FK_BOOKING_TABLE_BOOKING_EXTRA_SERVICE'
  })
  booking: BookingEntity;
  
  @ManyToOne(() => ExtraServiceEntity, (extraService) => extraService.bookingExtraService, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ 
    name: 'extra_service_id',
    foreignKeyConstraintName: 'FK_EXTRA_SERVICE_TABLE_BOOKING_EXTRA_SERVICE'
  })
  extraService: ExtraServiceEntity;
}
