import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PackageEntity } from './package.entity';

@Entity({
  name: 'service',
})
export class ServiceEntity extends BaseEntity {
  @Column()
  name: string;
  
  @Column({ nullable: true })
  description: string;
  
  @Column({ default: false })
  activate: boolean;
  
  @Column({
    nullable: true
  })
  icon: string;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @OneToMany(() => PackageEntity, (packageEntity) => packageEntity.service)
  package: PackageEntity[];
}
