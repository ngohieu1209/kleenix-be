import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { HouseWorkerEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';
import { FilterHouseWorkerDto } from 'src/modules/admin/house-worker/dto/query-house-worker.dto';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { BOOKING_STATUS } from 'src/shared/enums/booking.enum';
import _ from 'lodash';

@Injectable()
export class HouseWorkerRepository extends Repository<HouseWorkerEntity> {
  constructor(
    @InjectRepository(HouseWorkerEntity)
    private readonly repository: Repository<HouseWorkerEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async isHouseWorkerExist(username: string): Promise<boolean> {
    const count = await this.repository.count({ where: { username } });
    return count > 0;
  }
  
  async getHouseWorkerWithPassword(username: string): Promise<HouseWorkerEntity> {
    const user = await this.createQueryBuilder('houseWorker')
      .andWhere('houseWorker.username = :username', { username })
      .addSelect('houseWorker.password')
      .getOne()
    if(!user) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    return user;
  }
  
  async getHouseWorkerByIdWithPassword(id: string): Promise<HouseWorkerEntity> {
    const user = await this.createQueryBuilder('houseWorker')
      .andWhere('houseWorker.id = :id', { id })
      .addSelect('houseWorker.password')
      .getOne()
    if(!user) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    return user;
  }
  
  async getHouseWorkerById(houseWorkerId: string): Promise<HouseWorkerEntity> {
    const houseWorker = await this.findOne({ where: { id: houseWorkerId } });
    if(!houseWorker) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    return transformToPlain<HouseWorkerEntity>(houseWorker);
  }
  
  async getListHouseWorker(filterHouseWorker: FilterHouseWorkerDto): Promise<PaginationResponse<HouseWorkerEntity>> {
    const { page, limit, search, sortBy, sortOrder, createdAt } = filterHouseWorker;
    const query = this.createQueryBuilder('houseWorker');
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    if (sortBy) {
      query.orderBy(`houseWorker.${sortBy}`, order);
    } else {
      query.orderBy(`houseWorker.createdAt`, order);
    }
    if (search) {
      query.andWhere('houseWorker.name LIKE :search', { search: `%${search}%` });
    }

    if (createdAt) {
      query.andWhere('DATE(houseWorker.createdAt) = :createdAt', { createdAt });
    }
    
    const offset = (page - 1) * limit;
    query.offset(offset).limit(limit);
    const [data, total] = await query.getManyAndCount();
    return {
      data,
      metadata: {
        total,
        totalPage: Math.ceil(total / limit) || 1,
        page
      }
    }
  }
  
  async amountHouseWorker(): Promise<number> {
    return await this.count();
  }
  
  async getTopHouseWorkers(): Promise<any> {
    const query = this.createQueryBuilder('houseWorker')
    // const subQuery = query.subQuery()
    // .select('houseWorker.id', 'id')
    // .from('house_worker', 'houseWorker')
    // .leftJoin('houseWorker.assignment', 'assignment')
    // .innerJoin('assignment.booking', 'booking')
    // .addSelect('COUNT(booking.id)', 'bookingCount')
    // .where('booking.status = :status', { status: BOOKING_STATUS.COMPLETED })
    // .groupBy('houseWorker.id')
    // .having('COUNT(booking.id) > 0')
    // .getQuery();
      // .leftJoinAndSelect('houseWorker.assignment', 'assignment')
      // .leftJoinAndSelect('assignment.booking', 'booking')
      // .addSelect('COUNT(booking.id)', 'bookingCount')
      // .where('booking.status = :status', { status: BOOKING_STATUS.COMPLETED })
      // .groupBy('houseWorker.id, assignment.id, booking.id')
      // .orderBy('bookingCount', 'DESC')
      // .limit(6)
    // query.andWhere(`houseWorker.id IN ${subQuery}`);
    .leftJoin('houseWorker.assignment', 'assignment')
    .innerJoin('assignment.booking', 'booking')
    .addSelect('COUNT(booking.id)', 'bookingCount')
    .where('booking.status = :status', { status: BOOKING_STATUS.COMPLETED })
    .groupBy('houseWorker.id')
    .having('COUNT(booking.id) > 0')
    .orderBy('COUNT(booking.id)', 'DESC')
    .limit(6)
    
    const houseWorkers = await query.getRawMany();
    return _.map(houseWorkers, (houseWorker) => {
      return {
        id: houseWorker.houseWorker_id,
        name: houseWorker.houseWorker_name,
        avatar: houseWorker.houseWorker_avatar,
        bookingCount: houseWorker.bookingCount
      }
    });
  }
}
