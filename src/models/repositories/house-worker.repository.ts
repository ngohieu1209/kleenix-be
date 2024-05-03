import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { HouseWorkerEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';
import { FilterHouseWorkerDto } from 'src/modules/admin/house-worker/dto/query-house-worker.dto';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';

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
}
