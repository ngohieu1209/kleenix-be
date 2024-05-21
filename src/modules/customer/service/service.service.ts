import { Injectable } from '@nestjs/common';

import _ from 'lodash';
import { ServiceRepository, PackageRepository } from 'src/models/repositories';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';

@Injectable()
export class ServiceService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly packageRepository: PackageRepository
  ) {}

  async getListServices(customerId: string): Promise<any> {
    const services = await this.serviceRepository.getListServiceActivate();
    return services;
  }
  
  async getListPackageService(customerId: string, serviceId: string): Promise<any> {
    const service = await this.serviceRepository.getServiceById(serviceId);
    const packages = await this.packageRepository.getListPackageActivateByService(serviceId);
    return {
      ...service,
      packages
    };
  }
}