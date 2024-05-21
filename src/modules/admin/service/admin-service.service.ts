import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource, In } from 'typeorm';
import _ from 'lodash'
import { ServiceRepository, PackageRepository } from 'src/models/repositories';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceEntity } from 'src/models/entities';
import { FilterServiceDto } from './dto/query-service.dto';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UploadLocalService } from 'src/providers/upload/local.service';
import { UPLOAD_PATH } from 'src/shared/constants';

@Injectable()
export class ManageServiceService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly packageRepository: PackageRepository,
    private readonly uploadLocalService: UploadLocalService,
  ) {}

  async createService(createService: CreateServiceDto, icon: Express.Multer.File): Promise<ServiceEntity> {
    const { name, description } = createService;
    const checkServiceExist = await this.serviceRepository.isServiceExist(name);
    if(checkServiceExist) {
      throw new BaseException(ERROR.SERVICE_EXISTED)
    }
  
    const newService = new ServiceEntity();
    newService.name = name;
    newService.description = description;
    if(icon) {
      const iconImage: string = (await this.uploadLocalService.putFile(icon, UPLOAD_PATH.IMAGE, 'icon'))?.path
      newService.icon = iconImage
    }
    return await this.serviceRepository.save(newService);
  }
  
  async updateService(serviceId: string, updateService: UpdateServiceDto, icon: Express.Multer.File): Promise<any> {
    const service = await this.serviceRepository.getServiceById(serviceId);
    if(icon) {
      if(service.icon) {
        await this.uploadLocalService.deleteFile(service.icon)
      }
      const iconImage: string = (await this.uploadLocalService.putFile(icon, UPLOAD_PATH.IMAGE, 'icon'))?.path
      service.icon = iconImage
    }
    const saveService = await this.serviceRepository.save({
      ...service,
      ...updateService
    });
    return saveService;
  }
  
  async getService(serviceId: string): Promise<any> {
    const service = await this.serviceRepository.getServiceById(serviceId);
    const packages = await this.packageRepository.getListPackageByService(serviceId);
    return {
      ...service,
      packages
    }
  }
  
  async getListServices(filterService: FilterServiceDto): Promise<any> {
    const services = await this.serviceRepository.getListServices(filterService);
    const customServices = _.map(services.data, async(service) => {
      const packages = await this.packageRepository.getListPackageByService(service.id);
      return {
        ...service,
        packages
      }
    })
    return {
      data: await Promise.all(customServices),
      metadata: services.metadata
    }
  }
  
  async deleteService(serviceId: string): Promise<boolean> {
    const { affected } = await this.serviceRepository.softDelete({ id: serviceId });
    if(affected === 0) {
      throw new BaseException(ERROR.SERVICE_NOT_EXIST);
    }
    return true;
  }
}