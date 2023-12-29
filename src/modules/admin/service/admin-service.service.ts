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

@Injectable()
export class ManageServiceService {
  constructor(
    private readonly serviceRepository: ServiceRepository
  ) {}

  async createService(createService: CreateServiceDto): Promise<ServiceEntity> {
    const { name } = createService;
    const checkServiceExist = await this.serviceRepository.isServiceExist(name);
    if(checkServiceExist) {
      throw new BaseException(ERROR.SERVICE_EXISTED)
    }
  
    const newService = new ServiceEntity();
    newService.name = name;  
    
    return await this.serviceRepository.save(newService);
  }
}