import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AddressEntity } from './address.entity';

@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity {
  @Column({ select: false })
  password: string;
  
  @Column()
  name: string;
  
  @Column({ name: 'phone_code' })
  phoneCode: string;
  
  @Column({ name: 'phone_number' })
  phoneNumber: string;
  
  @Column({
    default: false
  })
  verify: boolean;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @OneToMany(() => AddressEntity, (address) => address.user)
  address: AddressEntity[];
}
