import { Injectable } from '@nestjs/common';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import _ from 'lodash'
import { PackageRepository, ServiceRepository } from 'src/models/repositories';
import { PackageEntity } from 'src/models/entities';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { FilterPackageDto } from './dto/query-package.dto';

@Injectable()
export class ManagePackageService {
  constructor(
    private readonly packageRepository: PackageRepository,
    private readonly serviceRepository: ServiceRepository
  ) {}

  async createPackage(createPackage: CreatePackageDto): Promise<PackageEntity> {
    const { serviceId, ...information } = createPackage;
    const service = await this.serviceRepository.getServiceById(serviceId);
  
    const newPackage = new PackageEntity();
    newPackage.service = service;
    _.assign(newPackage, information);
    
    return await this.packageRepository.save(newPackage);
  }
  
  async updatePackage(packageId: string, updatePackage: UpdatePackageDto): Promise<boolean> {
    console.log('winter-updatePackage', updatePackage)
    const { affected } = await this.packageRepository.update({ id: packageId }, updatePackage);
    if(affected === 0) {
      throw new BaseException(ERROR.PACKAGE_NOT_EXIST);
    }
    return true;
  }
  
  async getPackage(packageId: string): Promise<PackageEntity> {
    return await this.packageRepository.getPackageById(packageId);
  }
  
  async getListPackage(filterPackage: FilterPackageDto): Promise<PaginationResponse<PackageEntity>> {
    return await this.packageRepository.getListPackage(filterPackage);
  }
  
  async deletePackage(packageId: string): Promise<boolean> {
    const { affected } = await this.packageRepository.softDelete({ id: packageId });
    if(affected === 0) {
      throw new BaseException(ERROR.PACKAGE_NOT_EXIST);
    }
    return true;
  }
}