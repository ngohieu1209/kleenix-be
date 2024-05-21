import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BookingPackageEntity } from './booking-package.entity';
import { BookingEntity } from './booking.entity';
import { ServiceEntity } from './service.entity';

@Entity({
  name: 'package',
})
export class PackageEntity extends BaseEntity {
  @Column()
  name: string;
  
  @Column()
  duration: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  activate: boolean;
  
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 0,
    default: 0
  })
  price: number;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @OneToMany(() => BookingPackageEntity, (bookingPackage) => bookingPackage.package)
  bookingPackage: BookingPackageEntity[];
  
  @ManyToOne(() => ServiceEntity, (service) => service.package, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true
  })
  @JoinColumn({ 
    name: 'service_id',
    foreignKeyConstraintName: 'FK_SERVICE_TABLE_PACKAGE'
  })
  service: ServiceEntity;
}
