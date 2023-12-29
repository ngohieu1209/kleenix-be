import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AddressEntity } from './address.entity';
import { RoleEntity } from './role.entity';

@Entity({
  name: 'user',
})
@Unique( 'UQ_USER_PHONE' ,['phoneCode', 'phoneNumber'])
export class UserEntity extends BaseEntity {
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
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @OneToMany(() => AddressEntity, (address) => address.user)
  address: AddressEntity[];
}
