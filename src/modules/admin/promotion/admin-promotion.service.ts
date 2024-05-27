import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource, In } from 'typeorm';
import _ from 'lodash'
import { PromotionRepository } from 'src/models/repositories';
import { PromotionEntity } from 'src/models/entities';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { UploadLocalService } from 'src/providers/upload/local.service';
import { UPLOAD_PATH } from 'src/shared/constants';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class ManagePromotionService {
  constructor(
    private readonly promotionRepository: PromotionRepository,
    private readonly uploadLocalService: UploadLocalService,
  ) {}

  async createPromotion(createPromotion: CreatePromotionDto, image: Express.Multer.File): Promise<PromotionEntity> {
    const checkPromotionExist = await this.promotionRepository.isPromotionExist(createPromotion.name);
    if(checkPromotionExist) {
      throw new BaseException(ERROR.PROMOTION_EXISTED)
    }
  
    const newPromotion = new PromotionEntity();
    Object.assign(newPromotion, createPromotion);
    if(image) {
      const imageImage: string = (await this.uploadLocalService.putFile(image, UPLOAD_PATH.IMAGE, 'image'))?.path
      newPromotion.image = imageImage
    }
    return await this.promotionRepository.save(newPromotion);
  }
  
  async updatePromotion(promotionId: string, updatePromotion: UpdatePromotionDto, image: Express.Multer.File): Promise<any> {
    const promotion = await this.promotionRepository.getPromotionById(promotionId);
    if(image) {
      if(promotion.image) {
        await this.uploadLocalService.deleteFile(promotion.image)
      }
      const imageImage: string = (await this.uploadLocalService.putFile(image, UPLOAD_PATH.IMAGE, 'image'))?.path
      promotion.image = imageImage
    }
    const savePromotion = await this.promotionRepository.save({
      ...promotion,
      ...updatePromotion
    });
    return savePromotion;
  }
  
  async getPromotion(promotionId: string): Promise<any> {
    const promotion = await this.promotionRepository.getPromotionById(promotionId);
    return promotion;
  }
  
  async getListPromotions(): Promise<any> {
    const promotions = await this.promotionRepository.getListPromotion();
    return promotions;
  }
  
  async deletePromotion(promotionId: string): Promise<boolean> {
    const { affected } = await this.promotionRepository.softDelete({ id: promotionId });
    if(affected === 0) {
      throw new BaseException(ERROR.PROMOTION_NOT_EXIST);
    }
    return true;
  }
}