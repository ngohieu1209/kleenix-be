import { BadRequestException, Injectable } from '@nestjs/common';

import _ from 'lodash';
import { FeedbackEntity, NotificationEntity } from 'src/models/entities';
import { CustomerRepository, BookingRepository, FeedbackRepository, NotificationRepository } from 'src/models/repositories';
import { NotificationGateway } from 'src/modules/notification/notification.gateway';
import { BOOKING_STATUS } from 'src/shared/enums/booking.enum';
import { NOTIFICATION_TYPE } from 'src/shared/enums/notification.enum';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { getFirstEightChars } from 'src/shared/utils/utils';
import { DataSource } from 'typeorm';
import { PostFeedbackDto } from './dto/post-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly feedbackRepository: FeedbackRepository,
    private readonly bookingRepository: BookingRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationGateway: NotificationGateway,
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
    const saveFeedback = await this.feedbackRepository.save(newFeedback);
    const newNotification = new NotificationEntity();
    newNotification.booking = booking;
    newNotification.body = `Khách hàng ${customer.name} đã gửi phản hồi cho booking #${getFirstEightChars(booking.id)}`;
    newNotification.type = NOTIFICATION_TYPE.FEEDBACK;
    await this.notificationRepository.save(newNotification);
    await this.notificationGateway.refreshNotificationAdmin();
    return saveFeedback;
  }
}