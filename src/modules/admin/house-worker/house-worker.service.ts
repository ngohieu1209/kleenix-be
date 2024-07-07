import { Injectable } from '@nestjs/common';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import _ from 'lodash'
import { compare, hash } from 'bcryptjs';
import { AssignmentRepository, HouseWorkerRepository } from 'src/models/repositories';
import { HouseWorkerEntity } from 'src/models/entities';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { CreateHouseWorkerDto } from './dto/create-house-worker.dto';
import { COMMON_CONSTANT, UPLOAD_PATH } from 'src/shared/constants';
import { UpdateHouseWorkerDto } from './dto/update-house-worker.dto';
import { FilterHouseWorkerDto } from './dto/query-house-worker.dto';
import { FilterAdminBookingDto } from '../booking/dto/query-admin-booking.dto';
import { UploadLocalService } from 'src/providers/upload/local.service';
import { ResetPasswordWorkerDto } from './dto/reset-password-worker.dto';

@Injectable()
export class ManageHouseWorkerService {
  constructor(
    private readonly houseWorkerRepository: HouseWorkerRepository,
    private readonly assignmentRepository: AssignmentRepository,
    private readonly uploadLocalService: UploadLocalService,
  ) {}

  async createHouseWorker(createHouseWorker: CreateHouseWorkerDto, avatar: Express.Multer.File): Promise<HouseWorkerEntity> {
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
    if(avatar) {
      const avatarImage: string = (await this.uploadLocalService.putFile(avatar, UPLOAD_PATH.IMAGE, 'avatar'))?.path
      newHouseWorker.avatar = avatarImage
    }
    
    return await this.houseWorkerRepository.save(newHouseWorker);
  }
  
  async updateHouseWorker(houseWorkerId: string, updateHouseWorker: UpdateHouseWorkerDto, avatar: Express.Multer.File): Promise<any> {
    const houseWorker = await this.houseWorkerRepository.getHouseWorkerById(houseWorkerId);
    if(avatar) {
      if(houseWorker.avatar) {
        await this.uploadLocalService.deleteFile(houseWorker.avatar)
      }
      const avatarImage: string = (await this.uploadLocalService.putFile(avatar, UPLOAD_PATH.IMAGE, 'avatar'))?.path
      houseWorker.avatar = avatarImage
    }
    const saveHouseWorker = await this.houseWorkerRepository.save({
      ...houseWorker,
      ...updateHouseWorker
    });

    return saveHouseWorker;
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
  
  async resetPasswordHouseWorker(resetPassword: ResetPasswordWorkerDto) {
    const { houseWorkerId, newPassword } = resetPassword;
    const houseWorker = await this.houseWorkerRepository.getHouseWorkerByIdWithPassword(houseWorkerId);
    const hashPassword = await hash(
      newPassword,
      COMMON_CONSTANT.BCRYPT_SALT_ROUND
    );
    const { affected } = await this.houseWorkerRepository.update({ id: houseWorker.id }, {
      password: hashPassword
    })
    return affected > 0;
  }
}