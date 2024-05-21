import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AddressEntity } from './address.entity';
import { BOOKING_STATUS } from '../../shared/enums/booking.enum';
import { PackageEntity } from './package.entity';
import { BookingExtraServiceEntity } from './booking-extra-service.entity';
import { AssignmentEntity } from './assignment.entity';
import { BookingPackageEntity } from './booking-package.entity';
// import { BookingPackageEntity } from './booking-package.entity';

@Entity({
  name: 'booking',
})
export class BookingEntity extends BaseEntity {
  @Column()
  duration: number;
  
  @Column({ nullable: true })
  note: string;
  
  @Column({ name: 'date_time' })
  dateTime: Date;
  
  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 10,
    scale: 0,
    default: 0
  })
  totalPrice: number;
  
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
    enum: BOOKING_STATUS,
    enumName: 'BOOKING_STATUS_ENUM'
  })
  status: BOOKING_STATUS;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @OneToMany(() => BookingExtraServiceEntity, (bookingExtraService) => bookingExtraService.booking)
  bookingExtraService: BookingExtraServiceEntity[];
  
  @OneToMany(() => BookingPackageEntity, (bookingPackage) => bookingPackage.booking)
  bookingPackage: BookingPackageEntity[];
  
  @OneToMany(() => AssignmentEntity, (assignment) => assignment.booking)
  assignment: AssignmentEntity[]
  
  @ManyToOne(() => AddressEntity, (address) => address.booking, {
    onDelete: 'SET NULL',
    orphanedRowAction: 'nullify',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ 
    name: 'address_id',
    foreignKeyConstraintName: 'FK_ADDRESS_TABLE_BOOKING'
  })
  address: AddressEntity;
}
