import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AddressEntity } from './address.entity';
import { RoleEntity } from './role.entity';

@Entity({
  name: 'customer',
})
@Unique( 'UQ_USER_PHONE' ,['phoneCode', 'phoneNumber'])
export class CustomerEntity extends BaseEntity {
  @Column({ select: false })
  password: string;
  
  @Column()
  name: string;
  
  @Column({ name: 'phone_code', length: 3 })
  phoneCode: string;
  
  @Column({ name: 'phone_number', length: 12 })
  phoneNumber: string;
  
  @Column({ default: false })
  verify: boolean;
  
  @Column({
    name: 'k_pay',
    type: 'decimal',
    precision: 10,
    scale: 0,
    default: 0
  })
  kPay: number;
  
  @Column({
    name: 'k_points',
    type: 'decimal',
    precision: 10,
    scale: 0,
    default: 0
  })
  kPoints: number;
  
  @Column({
    name: 'used_pay',
    type: 'decimal',
    precision: 10,
    scale: 0,
    default: 0
  })
  usedPay: number;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @OneToMany(() => AddressEntity, (address) => address.customer)
  address: AddressEntity[];
}
