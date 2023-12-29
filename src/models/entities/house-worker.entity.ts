import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GENDER } from '../../shared/enums/gender.enum';
import { AdminManagerEntity } from './admin-manager.entity';
import { AssignmentEntity } from './assignment.entity';

@Entity({
  name: 'house_worker',
})
@Unique( 'UQ_HOUSE_WORKER_USERNAME' ,['username'])
export class HouseWorkerEntity extends BaseEntity {
  @Column()
  username: string;
  
  @Column({ select: false })
  password: string;
  
  @Column()
  name: string;
  
  @Column()
  age: number
  
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
    enum: GENDER,
    enumName: 'GENDER_ENUM'
  })
  gender: GENDER;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @OneToMany(() => AssignmentEntity, (assignment) => assignment.houseWorker)
  assignment: AssignmentEntity[]
  
  @ManyToOne(() => AdminManagerEntity, (adminManager) => adminManager.houseWorker, {
    onDelete: 'SET NULL',
    orphanedRowAction: 'nullify',
    nullable: true
  })
  @JoinColumn({ 
    name: 'manager_id',
    foreignKeyConstraintName: 'FK_MANAGER_TABLE_HOUSE_WORKER'
  })
  manager: AdminManagerEntity;
}
