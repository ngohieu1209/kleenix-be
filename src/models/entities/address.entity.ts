import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BookingEntity } from './booking.entity';
import { CustomerEntity } from './customer.entity';

@Entity({
  name: 'address',
})
export class AddressEntity extends BaseEntity {
  @Column()
  province: string;
  
  @Column()
  district: string;
  
  @Column()
  ward: string;

  @Column()
  street: string;
  
  @Column()
  long: string;
  
  @Column()
  lat: string;
  
  @Column({ name: 'is_default', default: false })
  isDefault: boolean;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  // ONE TO MANY
  @OneToMany(() => BookingEntity, (booking) => booking.address)
  booking: BookingEntity[];
  
  // MANY TO ONE
  @ManyToOne(() => CustomerEntity, (customer) => customer.address, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
  })
  @JoinColumn({ 
    name: 'customer_id',
    foreignKeyConstraintName: 'FK_USER_TABLE_ADDRESS'
  })
  customer: CustomerEntity;
}
