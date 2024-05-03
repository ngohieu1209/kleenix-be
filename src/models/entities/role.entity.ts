import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CustomerEntity } from './customer.entity';
import { Role } from '../../shared/enums/role.enum';
import { AdminManagerEntity } from './admin-manager.entity';

@Entity({
  name: 'role',
})
@Unique('UQ_ROLE_NAME', ['name'])
export class RoleEntity extends BaseEntity {
  @Column({
    transformer: {
      to(value: string) {
        return value.toUpperCase();
      },
      from(value: string) {
        // Do nothing
        return value;
      }
    },
    nullable: false,
    type: 'enum',
    enum: Role,
    enumName: 'ROLE_ENUM'
  })
  name: Role;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @OneToMany(() => AdminManagerEntity, (adminManager) => adminManager.role)
  adminManager: AdminManagerEntity[];
}