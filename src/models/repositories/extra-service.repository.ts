import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraServiceEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { endOfDay, startOfDay } from 'date-fns';
import { FilterExtraServiceDto } from 'src/modules/admin/extra-service/dto/query-extra-service.dto';

@Injectable()
export class ExtraServiceRepository extends Repository<ExtraServiceEntity> {
  constructor(
    @InjectRepository(ExtraServiceEntity)
    private readonly repository: Repository<ExtraServiceEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async isExtraServiceExist(name: string): Promise <boolean> {
    const count = await this.count({ where: { name } });
    return count > 0;
  }
  
  async getExtraServiceById(extraServiceId: number): Promise<ExtraServiceEntity> {
    const extraService = await this.findOne({ where: { id: extraServiceId } });
    if(!extraService) {
      throw new BaseException(ERROR.EXTRA_SERVICE_NOT_EXIST);
    }
    return transformToPlain<ExtraServiceEntity>(extraService);
  }
  
  async getListExtraServices(filterExtraService: FilterExtraServiceDto): Promise<PaginationResponse<ExtraServiceEntity>> {
    const { page, limit, search, sortBy, sortOrder, createdAt, startDate, endDate } = filterExtraService;
    const query = this.createQueryBuilder('extraService');
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    if (sortBy) {
      query.orderBy(`extraService.${sortBy}`, order);
    } else {
      query.orderBy(`extraService.createdAt`, order);
    }
    if (search) {
      query.andWhere('extraService.name LIKE :search', { search: `%${search}%` });
    }

    if (createdAt) {
      query.andWhere('DATE(extraService.createdAt) = :createdAt', { createdAt });
    }

    if (startDate && endDate) {
      query.andWhere('DATE(extraService.createdAt) BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(new Date(startDate)),
        endDate: endOfDay(new Date(endDate)),
      });
    } else if(startDate) {
      query.andWhere('DATE(extraService.createdAt) >= :startDate', {
        startDate: startOfDay(new Date(startDate)),
      });
    } else if(endDate) {
      query.andWhere('DATE(extraService.createdAt) <= :endDate', {
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
