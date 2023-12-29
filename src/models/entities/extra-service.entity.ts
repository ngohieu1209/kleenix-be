import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BookingExtraServiceEntity } from './booking-extra-service.entity';

@Entity({
  name: 'extra_service',
})
export class ExtraServiceEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  duration: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  activate: boolean;
  
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 0,
    default: 0
  })
  price: number;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @OneToMany(() => BookingExtraServiceEntity, (bookingExtraService) => bookingExtraService.extraService)
  bookingExtraService: BookingExtraServiceEntity[];
}
