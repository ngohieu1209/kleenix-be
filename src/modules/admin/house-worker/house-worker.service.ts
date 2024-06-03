import { Injectable } from '@nestjs/common';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import _ from 'lodash'
import { compare, hash } from 'bcryptjs';
import { AssignmentRepository, HouseWorkerRepository } from 'src/models/repositories';
import { HouseWorkerEntity } from 'src/models/entities';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { CreateHouseWorkerDto } from './dto/create-house-worker.dto';
import { COMMON_CONSTANT } from 'src/shared/constants';
import { UpdateHouseWorkerDto } from './dto/update-house-worker.dto';
import { FilterHouseWorkerDto } from './dto/query-house-worker.dto';
import { FilterAdminBookingDto } from '../booking/dto/query-admin-booking.dto';

@Injectable()
export class ManageHouseWorkerService {
  constructor(
    private readonly houseWorkerRepository: HouseWorkerRepository,
    private readonly assignmentRepository: AssignmentRepository
  ) {}

  async createHouseWorker(createHouseWorker: CreateHouseWorkerDto): Promise<HouseWorkerEntity> {
    const { username, password, ...information } = createHouseWorker;
    const checkHouseWorkerExist = await this.houseWorkerRepository.isHouseWorkerExist(username);
    if(checkHouseWorkerExist) {
      throw new BaseException(ERROR.USER_EXISTED)
    }
    
    const hashPassword = await hash(
      password,
      COMMON_CONSTANT.BCRYPT_SALT_ROUND
    );
    // TODO: còn thiếu phần manager_id
    const newHouseWorker = new HouseWorkerEntity();
    newHouseWorker.username = username;
    newHouseWorker.password = hashPassword;
    _.assign(newHouseWorker, information);
    
    return await this.houseWorkerRepository.save(newHouseWorker);
  }
  
  async updateHouseWorker(houseWorkerId: string, updateHouseWorker: UpdateHouseWorkerDto): Promise<boolean> {
    const { affected } = await this.houseWorkerRepository.update({ id: houseWorkerId }, updateHouseWorker);
    if(affected === 0) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    return true;
  }
  
  async getHouseWorker(houseWorkerId: string): Promise<HouseWorkerEntity> {
    return await this.houseWorkerRepository.getHouseWorkerById(houseWorkerId);
  }
  
  async getListHouseWorker(filterHouseWorker: FilterHouseWorkerDto): Promise<PaginationResponse<HouseWorkerEntity>> {
    return await this.houseWorkerRepository.getListHouseWorker(filterHouseWorker);
  }
  
  async deleteHouseWorker(houseWorkerId: string): Promise<boolean> {
    const { affected } = await this.houseWorkerRepository.softDelete({ id: houseWorkerId });
    if(affected === 0) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    return true;
  }
  
  async getListAssignmentHouseWorker(houseWorkerId: string, filterAdminBooking: FilterAdminBookingDto) {
    const assignment = await this.assignmentRepository.getAssignmentWithStatusByHouseWorker(houseWorkerId, filterAdminBooking);
    return assignment;
  }
}