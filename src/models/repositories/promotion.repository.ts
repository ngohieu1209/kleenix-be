import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';
import { PromotionEntity } from '../entities';

@Injectable()
export class PromotionRepository extends Repository<PromotionEntity> {
  constructor(
    @InjectRepository(PromotionEntity)
    private readonly repository: Repository<PromotionEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  
  async isPromotionExist(name: string): Promise <boolean> {
    const count = await this.count({ where: { name } });
    return count > 0;
  }
  
  async getPromotionById(promotionId: string): Promise<PromotionEntity> {
    const promotion = await this.findOne({ where: { id: promotionId } });
    if(!promotion) {
      throw new BaseException(ERROR.PROMOTION_NOT_EXIST);
    }
    return transformToPlain<PromotionEntity>(promotion);
  }
  
  async getListPromotion(): Promise<any> {
    const query = this.repository.createQueryBuilder('promotion')
    query.orderBy('promotion.createdAt', 'DESC');
    const promotions = await query.getMany();
    return promotions;
  }
  
  async getListPromotionWithCustomer(idsClaimed: string[]): Promise<any> {
    const query = this.repository.createQueryBuilder('promotion')
    if(idsClaimed.length > 0) {
      query.andWhere('promotion.id NOT IN (:...idsClaimed)', { idsClaimed })
    }
    query.andWhere('promotion.activate = :activate', { activate: true })
    query.andWhere('promotion.startTime <= :now', { now: new Date() })
    query.andWhere('promotion.endTime >= :now', { now: new Date() })
    query.andWhere('promotion.amount > :amount', { amount: 0 })
    query.orderBy('promotion.createdAt', 'DESC');
    const promotions = await query.getMany();
    return promotions;
  }
}
