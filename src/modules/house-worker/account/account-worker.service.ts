import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import _ from 'lodash';
import { HouseWorkerEntity } from 'src/models/entities';
import { HouseWorkerRepository } from 'src/models/repositories';
import { UpdateCustomerDto } from 'src/modules/customer/account/dto/update-user.dto';
import { UploadLocalService } from 'src/providers/upload/local.service';
import { UPLOAD_PATH } from 'src/shared/constants';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';

@Injectable()
export class WorkerAccountService {
  constructor(
    private readonly houseWorkerRepository: HouseWorkerRepository,
    private readonly uploadLocalService: UploadLocalService,
  ) {}

  async getMe(userId: string): Promise<HouseWorkerEntity> {
    return await this.houseWorkerRepository.getHouseWorkerById(userId);
  }
  
  async updateInformation(userId: string, updateUser: UpdateCustomerDto, avatar: Express.Multer.File) {
    const houseWorker = await this.houseWorkerRepository.getHouseWorkerById(userId);
    if(avatar) {
      if(houseWorker.avatar) {
        await this.uploadLocalService.deleteFile(houseWorker.avatar)
      }
      const avatarImage: string = (await this.uploadLocalService.putFile(avatar, UPLOAD_PATH.IMAGE, 'avatar'))?.path
      houseWorker.avatar = avatarImage
    }
    const saveHouseWorker = await this.houseWorkerRepository.save({
      ...houseWorker,
      ...updateUser
    });

    return saveHouseWorker;
  }
}