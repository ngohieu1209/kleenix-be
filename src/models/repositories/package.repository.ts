import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PackageEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';
import { FilterPackageDto } from 'src/modules/admin/package/dto/query-package.dto';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class PackageRepository extends Repository<PackageEntity> {
  constructor(
    @InjectRepository(PackageEntity)
    private readonly repository: Repository<PackageEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async getPackageById(packageId: string): Promise<PackageEntity> {
    const packageService = await this.findOne({ where: { id: packageId } });
    if(!packageService) {
      throw new BaseException(ERROR.PACKAGE_NOT_EXIST);
    }
    return transformToPlain<PackageEntity>(packageService);
  }
  
  async getListPackage(filterPackage: FilterPackageDto): Promise<PaginationResponse<PackageEntity>> {
    const { page, limit, search, sortBy, sortOrder, createdAt, startDate, endDate } = filterPackage;
    const query = this.createQueryBuilder('package');
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    if (sortBy) {
      query.orderBy(`package.${sortBy}`, order);
    } else {
      query.orderBy(`package.createdAt`, order);
    }
    if (search) {
      query.andWhere('package.description LIKE :search', { search: `%${search}%` });
    }

    if (createdAt) {
      query.andWhere('DATE(package.createdAt) = :createdAt', { createdAt });
    }

    if (startDate && endDate) {
      query.andWhere('DATE(package.createdAt) BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(new Date(startDate)),
        endDate: endOfDay(new Date(endDate)),
      });
    } else if(startDate) {
      query.andWhere('DATE(package.createdAt) >= :startDate', {
        startDate: startOfDay(new Date(startDate)),
      });
    } else if(endDate) {
      query.andWhere('DATE(package.createdAt) <= :endDate', {
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
