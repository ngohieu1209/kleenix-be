import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AddressEntity } from './address.entity';
import { BOOKING_STATUS } from '../../shared/enums/booking.enum';
import { PackageEntity } from './package.entity';
import { BookingExtraServiceEntity } from './booking-extra-service.entity';
import { HouseWorkerEntity } from './house-worker.entity';
import { BookingEntity } from './booking.entity';
import { CustomerPromotionEntity } from './customer-promotion.entity';

@Entity({
  name: 'promotion',
})
export class PromotionEntity extends BaseEntity {
  @Column()
  name: string;
  
  @Column({
    nullable: false
  })
  image: string;
  
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 0,
    default: 0
  })
  amount: number;
  
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 0,
    default: 0
  })
  point: number;
  
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 0,
    default: 0
  })
  discount: number;
  
  @Column()
  description: string;
  
  @Column({ name: 'start_time' })
  startTime: Date;
  
  @Column({ name: 'end_time' })
  endTime: Date;
  
  @Column({ default: false })
  activate: boolean;
  
  // RELATION
  // -----------------------------------------------------------------------------

  @OneToMany(() => CustomerPromotionEntity, (customerPromotion) => customerPromotion.promotion)
  customerPromotion: CustomerPromotionEntity[];
}
