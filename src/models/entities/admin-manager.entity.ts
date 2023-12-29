import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AddressEntity } from './address.entity';
import { RoleEntity } from './role.entity';
import { HouseWorkerEntity } from './house-worker.entity';

@Entity({
  name: 'admin_manager',
})
@Unique( 'UQ_ADMIN_MANAGER_USERNAME' ,['username'])
export class AdminManagerEntity extends BaseEntity {
  @Column()
  username: string;
  
  @Column({ select: false })
  password: string;
  
  @Column()
  name: string;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @OneToMany(() => HouseWorkerEntity, (houseWorker) => houseWorker.manager)
  houseWorker: HouseWorkerEntity[];
  
  @ManyToOne(() => RoleEntity, (role) => role.adminManager, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ 
    name: 'role_id',
    foreignKeyConstraintName: 'FK_ROLE_TABLE_ADMIN_MANAGER'
  })
  role: RoleEntity;
}
