import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BookingEntity } from './booking.entity';
import { CustomerEntity } from './customer.entity';
import { PromotionEntity } from './promotion.entity';

@Entity({
  name: 'customer_promotion',
})
export class CustomerPromotionEntity extends BaseEntity {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 0,
    nullable: true,
  })
  priceDiscount: number;
  
  @Column({
    default: false
  })
  isUsed: boolean;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @ManyToOne(() => CustomerEntity, (customer) => customer.customerPromotion, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
  })
  @JoinColumn({ 
    name: 'customer_id',
    foreignKeyConstraintName: 'FK_CUSTOMER_TABLE_CUSTOMER_PROMOTION'
  })
  customer: CustomerEntity;
  
  @ManyToOne(() => PromotionEntity, (promotion) => promotion.customerPromotion, {
    onDelete: 'SET NULL',
    orphanedRowAction: 'nullify',
    eager: true,
    nullable: true,
  })
  @JoinColumn({ 
    name: 'promotion_id',
    foreignKeyConstraintName: 'FK_PROMOTION_TABLE_CUSTOMER_PROMOTION'
  })
  promotion: PromotionEntity;
  
  @ManyToOne(() => BookingEntity, (booking) => booking.customerPromotion, {
    onDelete: 'SET NULL',
    orphanedRowAction: 'nullify',
    eager: true,
    nullable: true,
  })
  @JoinColumn({ 
    name: 'booking_id',
    foreignKeyConstraintName: 'FK_BOOKING_TABLE_CUSTOMER_PROMOTION'
  })
  booking: BookingEntity;
}
