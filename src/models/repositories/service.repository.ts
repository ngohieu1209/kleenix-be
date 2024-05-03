import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ServiceEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';
import { endOfDay, startOfDay } from 'date-fns';
import { FilterServiceDto } from 'src/modules/admin/service/dto/query-service.dto';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';

@Injectable()
export class ServiceRepository extends Repository<ServiceEntity> {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly repository: Repository<ServiceEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async isServiceExist(name: string): Promise <boolean> {
    const count = await this.count({ where: { name } });
    return count > 0;
  }
  
  async getServiceById(serviceId: string): Promise<ServiceEntity> {
    const service = await this.findOne({ where: { id: serviceId } });
    if(!service) {
      throw new BaseException(ERROR.SERVICE_NOT_EXIST);
    }
    return transformToPlain<ServiceEntity>(service);
  }
  
  async getListServices(filterService: FilterServiceDto): Promise<PaginationResponse<ServiceEntity>> {
    const { page, limit, search, sortBy, sortOrder, createdAt, startDate, endDate } = filterService;
    const query = this.createQueryBuilder('service');
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    if (sortBy) {
      query.orderBy(`service.${sortBy}`, order);
    } else {
      query.orderBy(`service.createdAt`, order);
    }
    if (search) {
      query.andWhere('service.name LIKE :search', { search: `%${search}%` });
    }

    if (createdAt) {
      query.andWhere('DATE(service.createdAt) = :createdAt', { createdAt });
    }

    if (startDate && endDate) {
      query.andWhere('DATE(service.createdAt) BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(new Date(startDate)),
        endDate: endOfDay(new Date(endDate)),
      });
    } else if(startDate) {
      query.andWhere('DATE(service.createdAt) >= :startDate', {
        startDate: startOfDay(new Date(startDate)),
      });
    } else if(endDate) {
      query.andWhere('DATE(service.createdAt) <= :endDate', {
        endDate: endOfDay(new Date(endDate)),
      });
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
