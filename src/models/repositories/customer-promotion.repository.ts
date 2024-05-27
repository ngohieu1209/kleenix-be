import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';
import { CustomerPromotionEntity } from '../entities';
import _ from 'lodash';

@Injectable()
export class CustomerPromotionRepository extends Repository<CustomerPromotionEntity> {
  constructor(
    @InjectRepository(CustomerPromotionEntity)
    private readonly repository: Repository<CustomerPromotionEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async getPromotionsMyOwn(customerId: string): Promise<any> {
    const query = this.repository.createQueryBuilder('customerPromotion')
      .leftJoinAndSelect('customerPromotion.promotion', 'promotion')
      .andWhere('customerPromotion.customer = :customerId', { customerId })
      .andWhere('customerPromotion.booking is NULL')
      
    const customerPromotions = await query.getMany();
    return customerPromotions;
  }
  
  async idsPromotionsClaimed(customerId: string): Promise<any> {
    const query = this.repository.createQueryBuilder('customerPromotion')
      .leftJoinAndSelect('customerPromotion.promotion', 'promotion')
      .andWhere('customerPromotion.customer = :customerId', { customerId })
    
    const customerPromotions = await query.getMany();
    const idsPromotion = _.map(customerPromotions, (customerPromotion) => {
      if(customerPromotion.promotion !== null) {
        return customerPromotion.promotion.id;
      }
    })
    return idsPromotion;
  }
  
  async isPromotionClaimed(customerId: string, promotionId: string): Promise<any> {
    const query = this.repository.createQueryBuilder('customerPromotion')
      .andWhere('customerPromotion.customer = :customerId', { customerId })
      .andWhere('customerPromotion.promotion = :promotionId', { promotionId })
      
    const count = await query.getCount();
    return count > 0;
  }
  
  async isPromotionUsed(customerId: string, promotionId: string): Promise<any> {
    const query = this.repository.createQueryBuilder('customerPromotion')
      .andWhere('customerPromotion.customer = :customerId', { customerId })
      .andWhere('customerPromotion.promotion = :promotionId', { promotionId })
      .andWhere('customerPromotion.booking is NOT NULL')
      
    const count = await query.getCount();
    return count > 0;
  }
  
  async getPromotionClaimed(customerId: string, promotionId: string): Promise<CustomerPromotionEntity> {
    const query = this.repository.createQueryBuilder('customerPromotion')
      .leftJoinAndSelect('customerPromotion.promotion', 'promotion')
      .andWhere('customerPromotion.customer = :customerId', { customerId })
      .andWhere('customerPromotion.promotion = :promotionId', { promotionId })
      .andWhere('customerPromotion.booking is NULL')
      
    const customerPromotion = await query.getOne();
    
    if(!customerPromotion) {
      throw new BaseException(ERROR.PROMOTION_FAIL);
    }
    return transformToPlain<CustomerPromotionEntity>(customerPromotion);
  }
}
