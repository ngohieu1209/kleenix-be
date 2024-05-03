import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource, In } from 'typeorm';
import _ from 'lodash'
import { ServiceRepository } from 'src/models/repositories';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceEntity } from 'src/models/entities';
import { FilterServiceDto } from './dto/query-service.dto';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ManageServiceService {
  constructor(
    private readonly serviceRepository: ServiceRepository
  ) {}

  async createService(createService: CreateServiceDto): Promise<ServiceEntity> {
    const { name, description } = createService;
    const checkServiceExist = await this.serviceRepository.isServiceExist(name);
    if(checkServiceExist) {
      throw new BaseException(ERROR.SERVICE_EXISTED)
    }
  
    const newService = new ServiceEntity();
    newService.name = name;
    newService.description = description;
    
    return await this.serviceRepository.save(newService);
  }
  
  async updateService(serviceId: string, updateService: UpdateServiceDto): Promise<boolean> {
    const { affected } = await this.serviceRepository.update({ id: serviceId }, updateService);
    if(affected === 0) {
      throw new BaseException(ERROR.SERVICE_NOT_EXIST);
    }
    return true;
  }
  
  async getService(serviceId: string): Promise<ServiceEntity> {
    return await this.serviceRepository.getServiceById(serviceId);
  }
  
  async getListServices(filterService: FilterServiceDto): Promise<PaginationResponse<ServiceEntity>> {
    return await this.serviceRepository.getListServices(filterService);
  }
  
  async deleteService(serviceId: string): Promise<boolean> {
    const { affected } = await this.serviceRepository.softDelete({ id: serviceId });
    if(affected === 0) {
      throw new BaseException(ERROR.SERVICE_NOT_EXIST);
    }
    return true;
  }
}