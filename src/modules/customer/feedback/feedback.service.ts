import { BadRequestException, Injectable } from '@nestjs/common';

import _ from 'lodash';
import { FeedbackEntity } from 'src/models/entities';
import { CustomerRepository, BookingRepository, FeedbackRepository } from 'src/models/repositories';
import { BOOKING_STATUS } from 'src/shared/enums/booking.enum';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';
import { PostFeedbackDto } from './dto/post-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly feedbackRepository: FeedbackRepository,
    private readonly bookingRepository: BookingRepository,
  ) {}

  async getFeedback(customerId: string, bookingId: string): Promise<any> {
    const feedback = await this.feedbackRepository.getFeedbackByCustomer(customerId, bookingId);
    return feedback;
  }
  
  async feedback(customerId: string, postFeedback: PostFeedbackDto): Promise<any> {
    const { bookingId, feedback, rating } = postFeedback;
    const booking = await this.bookingRepository.getBookingById(bookingId);
    if(booking.status !== BOOKING_STATUS.COMPLETED) {
      throw new BaseException(ERROR.BOOKING_NOT_COMPLETED);
    }
    const isFeedbackExist = await this.feedbackRepository.isFeedbackExist(customerId, bookingId);
    if(isFeedbackExist) {
      throw new BaseException(ERROR.FEEDBACK_EXIST);
    }
    const customer = await this.customerRepository.getCustomerById(customerId);
    const newFeedback = new FeedbackEntity();
    newFeedback.customer = customer;
    newFeedback.booking = booking;
    newFeedback.feedback = feedback;
    newFeedback.rating = rating;
    return await this.feedbackRepository.save(newFeedback);
  }
}