import { BadRequestException, Injectable } from '@nestjs/common';

import _ from 'lodash';
import { CustomerPromotionEntity } from 'src/models/entities';
import { PromotionRepository, CustomerPromotionRepository, CustomerRepository, BookingRepository } from 'src/models/repositories';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';

@Injectable()
export class PromotionService {
  constructor(
    private readonly promotionRepository: PromotionRepository,
    private readonly customerPromotionRepository: CustomerPromotionRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly databaseUtilService: DatabaseUtilService,
    private readonly dataSource: DataSource
  ) {}

  async getListUsablePromotion(customerId: string): Promise<any> {
    const customerPromotions = await this.customerPromotionRepository.getPromotionsMyOwn(customerId);
    return customerPromotions;
  }
  
  async getListUsableClaim(customerId: string): Promise<any> {
    const idsPromotionClaimed = await this.customerPromotionRepository.idsPromotionsClaimed(customerId);
    const promotions = await this.promotionRepository.getListPromotionWithCustomer(idsPromotionClaimed);
    return promotions;
  }
  
  async claimPromotion(customerId: string, promotionId: string): Promise<any> {
    const isCheckPromotionClaimed = await this.customerPromotionRepository.isPromotionClaimed(customerId, promotionId);
    if(isCheckPromotionClaimed) {
      throw new BaseException(ERROR.PROMOTION_CLAIMED);
    }
    
    const promotion = await this.promotionRepository.getPromotionById(promotionId);
    if(Number(promotion.amount) <= 0) {
      throw new BaseException(ERROR.PROMOTION_SOLD_OUT);
    } 
    const customer = await this.customerRepository.getCustomerById(customerId);
    if(Number(customer.kPoints) < Number(promotion.point)) {
      throw new BaseException(ERROR.KPOINTS_NOT_ENOUGH);
    }
    const customerPromotion = new CustomerPromotionEntity();
    customerPromotion.customer = customer;
    customerPromotion.promotion = promotion;
    promotion.amount = Number(promotion.amount) - 1;
    await this.promotionRepository.save(promotion);
    await this.customerRepository.update({ id: customerId }, { kPoints: Number(customer.kPoints) - Number(promotion.point) });
    await this.customerPromotionRepository.save(customerPromotion);
    return true;
  }
}