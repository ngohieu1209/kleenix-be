import { Injectable } from '@nestjs/common';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import _ from 'lodash'
import { ExtraServiceRepository } from 'src/models/repositories';
import { CreateExtraServiceDto } from './dto/create-extra-service.dto';
import { ExtraServiceEntity } from 'src/models/entities';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { UpdateExtraServiceDto } from './dto/update-extra-service.dto';
import { FilterExtraServiceDto } from './dto/query-extra-service.dto';

@Injectable()
export class ManageExtraServiceService {
  constructor(
    private readonly extraServiceRepository: ExtraServiceRepository
  ) {}

  async createExtraService(createExtraService: CreateExtraServiceDto): Promise<ExtraServiceEntity> {
    const { name, description, duration, price } = createExtraService;
    const checkExtraServiceExist = await this.extraServiceRepository.isExtraServiceExist(name);
    if(checkExtraServiceExist) {
      throw new BaseException(ERROR.EXTRA_SERVICE_EXISTED)
    }
  
    const newExtraService = new ExtraServiceEntity();
    newExtraService.name = name;
    newExtraService.description = description;
    newExtraService.duration = duration;
    newExtraService.price = price;
    
    return await this.extraServiceRepository.save(newExtraService);
  }
  
  async updateExtraService(extraServiceId: string, updateExtraService: UpdateExtraServiceDto): Promise<boolean> {
    const { affected } = await this.extraServiceRepository.update({ id: extraServiceId }, updateExtraService);
    if(affected === 0) {
      throw new BaseException(ERROR.EXTRA_SERVICE_NOT_EXIST);
    }
    return true;
  }
  
  async getExtraService(extraServiceId: string): Promise<ExtraServiceEntity> {
    return await this.extraServiceRepository.getExtraServiceById(extraServiceId);
  }
  
  async getListExtraServices(filterExtraService: FilterExtraServiceDto): Promise<PaginationResponse<ExtraServiceEntity>> {
    return await this.extraServiceRepository.getListExtraServices(filterExtraService);
  }
  
  async deleteExtraService(extraServiceId: string): Promise<boolean> {
    const { affected } = await this.extraServiceRepository.softDelete({ id: extraServiceId });
    if(affected === 0) {
      throw new BaseException(ERROR.EXTRA_SERVICE_NOT_EXIST);
    }
    return true;
  }
}