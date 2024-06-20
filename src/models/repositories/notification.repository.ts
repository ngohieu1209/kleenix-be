import { Repository } from 'typeorm';
import { Injectable, Query } from '@nestjs/common';
import { NotificationEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';

@Injectable()
export class NotificationRepository extends Repository<NotificationEntity> {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  
  async countUnreadNotificationCustomer(customerId: string): Promise<number> {
    const query = this.createQueryBuilder('notification');
    query.andWhere('notification.customer = :customerId', { customerId });
    query.andWhere('notification.isMark = false');
    query.distinct(true)
    return query.getCount();
  }
  
  async countUnreadNotificationWorker(houseWorkerId: string): Promise<number> {
    const query = this.createQueryBuilder('notification');
    query.andWhere('notification.houseWorker = :houseWorkerId', { houseWorkerId });
    query.andWhere('notification.isMark = false');
    query.distinct(true)
    return query.getCount();
  }
  
  async countUnreadNotificationAdmin(): Promise<number> {
    const query = this.createQueryBuilder('notification');
    query.andWhere('notification.customer IS NULL');
    query.andWhere('notification.houseWorker IS NULL');
    query.andWhere('notification.isMark = false');
    query.distinct(true)
    return query.getCount();
  }
  
  async getNotificationsCustomer(customerId: string) {
    const query = this.createQueryBuilder('notification');
    query.leftJoinAndSelect('notification.booking', 'booking');
    query.andWhere('notification.customer = :customerId', { customerId });
    query.orderBy('notification.createdAt', 'DESC');
    const data = await query.getMany();
    return data;
  }
  async getNotificationsHouseWorker(houseWorkerId: string) {
    const query = this.createQueryBuilder('notification');
    query.leftJoinAndSelect('notification.booking', 'booking');
    query.andWhere('notification.houseWorker = :houseWorkerId', { houseWorkerId });
    query.orderBy('notification.createdAt', 'DESC');
    const data = await query.getMany();
    return data;
  }
  async getNotificationsAdmin() {
    const query = this.createQueryBuilder('notification');
    query.leftJoinAndSelect('notification.booking', 'booking');
    query.andWhere('notification.customer IS NULL');
    query.andWhere('notification.houseWorker IS NULL');
    query.orderBy('notification.createdAt', 'DESC');
    const data = await query.getMany();
    return data;
  }
}
