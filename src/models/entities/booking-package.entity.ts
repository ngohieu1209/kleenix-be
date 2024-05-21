import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BookingEntity } from './booking.entity';
import { PackageEntity } from './package.entity';

@Entity({
  name: 'booking_package',
})
export class BookingPackageEntity extends BaseEntity {
  @Column({ nullable: true })
  quantity: number;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @ManyToOne(() => BookingEntity, (booking) => booking.bookingPackage, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
  })
  @JoinColumn({ 
    name: 'booking_id',
    foreignKeyConstraintName: 'FK_BOOKING_TABLE_BOOKING_PACKAGE'
  })
  booking: BookingEntity;
  
  @ManyToOne(() => PackageEntity, (packageService) => packageService.bookingPackage, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
  })
  @JoinColumn({ 
    name: 'package_id',
    foreignKeyConstraintName: 'FK_PACKAGE_TABLE_BOOKING_PACKAGE'
  })
  package: PackageEntity;
}
