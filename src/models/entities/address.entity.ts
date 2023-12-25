import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

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
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @ManyToOne(() => UserEntity, (user) => user.address, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id'})
  user: UserEntity;
}
