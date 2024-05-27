import { Repository } from 'typeorm';
import { Injectable, Query } from '@nestjs/common';
import { FeedbackEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';

@Injectable()
export class FeedbackRepository extends Repository<FeedbackEntity> {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly repository: Repository<FeedbackEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async isFeedbackExist(customerId: string, bookingId: string): Promise <boolean> {
    const count = await this.count({ where: { booking: { id: bookingId}, customer: { id: customerId } } });
    return count > 0;
  }
  
  async getFeedbackByCustomer(customerId: string, bookingId: string): Promise<any> {
    const feedback = await this.findOne({ where: { booking: { id: bookingId}, customer: { id: customerId } } });
    if(!feedback) {
      return null;
    }
    return transformToPlain<FeedbackEntity>(feedback);
  }
  
  async getListFeedback() : Promise<any> {
    const feedbacks = await this.find();
    return transformToPlain<FeedbackEntity[]>(feedbacks);
  }
  
  async getFeedbackById(feedbackId: string) : Promise<any> {
    const query = this.createQueryBuilder('feedback')
      .innerJoinAndSelect('feedback.booking', 'booking')
      .innerJoinAndSelect('feedback.customer', 'customer')
      .leftJoinAndSelect('booking.assignment', 'assignment')
      .leftJoinAndSelect('assignment.houseWorker', 'houseWorker')
      .leftJoinAndSelect('booking.address', 'address')
      .andWhere('feedback.id = :feedbackId', { feedbackId });
    const feedback = await query.getOne();
    if(!feedback) {
      throw new BaseException(ERROR.FEEDBACK_NOT_EXIST);
    }
    return transformToPlain<FeedbackEntity>(feedback);
  }
}
